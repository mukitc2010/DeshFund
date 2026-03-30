import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let admin;
    try {
      admin = await requireRole("ADMIN");
    } catch {
      return Response.json(
        { success: false, data: null, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action, notes } = body as { action: string; notes?: string };

    if (!action || !["verify", "reject"].includes(action)) {
      return Response.json(
        { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Action must be 'verify' or 'reject'" } },
        { status: 400 }
      );
    }

    const verification = await prisma.verification.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!verification) {
      return Response.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Verification not found" } },
        { status: 404 }
      );
    }

    if (verification.status !== "PENDING") {
      return Response.json(
        { success: false, data: null, error: { code: "BAD_REQUEST", message: "Verification is not pending" } },
        { status: 400 }
      );
    }

    const newStatus = action === "verify" ? "VERIFIED" : "REJECTED";

    const txOps = [
      prisma.verification.update({
        where: { id },
        data: {
          status: newStatus,
          notes: notes || null,
          reviewedAt: new Date(),
        },
        include: { user: { include: { profile: true } } },
      }),
      prisma.notification.create({
        data: {
          userId: verification.userId,
          title: action === "verify" ? "Verification Approved" : "Verification Rejected",
          message: action === "verify"
            ? `Your ${verification.type} verification has been approved.`
            : `Your ${verification.type} verification has been rejected. ${notes || ""}`,
          link: "/profile",
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: `verification.${action}`,
          entity: "Verification",
          entityId: id,
          metadata: { type: verification.type, notes: notes || null },
        },
      }),
    ];

    // If verified, recalculate trust score
    if (action === "verify") {
      const allVerifications = await prisma.verification.findMany({
        where: { userId: verification.userId },
      });

      // Count this one as verified too
      const verifiedTypes = new Set(
        allVerifications
          .filter((v: any) => v.id === id || v.status === "VERIFIED")
          .map((v: any) => v.type)
      );

      const kycComplete = verifiedTypes.has("KYC_BASIC") || verifiedTypes.has("KYC_FULL");
      const businessReg = verifiedTypes.has("BUSINESS_REG");
      const revenueVerified = verifiedTypes.has("REVENUE_PROOF");

      let score = 0;
      if (kycComplete) score += 20;
      if (businessReg) score += 20;
      if (revenueVerified) score += 20;
      if (verifiedTypes.has("NID")) score += 15;
      if (verifiedTypes.has("KYC_FULL")) score += 10;

      // Check other trust score factors from existing record
      const existing = await prisma.trustScore.findUnique({
        where: { userId: verification.userId },
      });

      if (existing) {
        if (existing.teamListed) score += 5;
        if (existing.financialData) score += 5;
        if (existing.updatesPosted) score += 3;
        if (existing.docsUploaded) score += 2;
      }

      score = Math.min(100, score);

      txOps.push(
        prisma.trustScore.upsert({
          where: { userId: verification.userId },
          create: {
            userId: verification.userId,
            score,
            kycComplete,
            businessReg,
            revenueVerified,
          },
          update: {
            score,
            kycComplete,
            businessReg,
            revenueVerified,
          },
        }) as any
      );
    }

    const [updated] = await prisma.$transaction(txOps);

    return Response.json({
      success: true,
      data: { verification: updated },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Verification review error:", error);
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
