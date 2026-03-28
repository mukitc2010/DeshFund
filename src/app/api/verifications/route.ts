import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { z } from "zod";
import { createAuditLog } from "@/lib/audit";

const createVerificationSchema = z.object({
  type: z.enum(["NID", "BUSINESS_REG", "REVENUE_PROOF", "KYC_BASIC"]),
  documentUrl: z.string().url("Invalid document URL"),
});

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
        { status: 401 }
      );
    }

    const verifications = await prisma.verification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      data: { verifications },
      error: null,
    });
  } catch (error) {
    console.error("Get verifications error:", error);
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
        { status: 401 }
      );
    }

    if (user.role !== "FOUNDER") {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "FORBIDDEN",
            message: "Only founders can submit verifications",
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message,
          },
        },
        { status: 400 }
      );
    }

    const { type, documentUrl } = parsed.data;

    // Check for existing verification of the same type
    const existing = await prisma.verification.findUnique({
      where: { userId_type: { userId: user.id, type } },
    });

    if (existing) {
      if (existing.status === "VERIFIED") {
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "ALREADY_VERIFIED",
              message: `Your ${type} verification is already complete`,
            },
          },
          { status: 409 }
        );
      }

      if (existing.status === "PENDING") {
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "ALREADY_PENDING",
              message: `You already have a pending ${type} verification`,
            },
          },
          { status: 409 }
        );
      }

      // If REJECTED, allow resubmission by updating
      const verification = await prisma.verification.update({
        where: { id: existing.id },
        data: {
          status: "PENDING",
          documentUrl,
          notes: null,
          reviewedAt: null,
        },
      });

      await createAuditLog({
        userId: user.id,
        action: "verification.resubmit",
        entity: "Verification",
        entityId: verification.id,
        metadata: { type },
        ipAddress: request.headers.get("x-forwarded-for") || undefined,
      });

      return Response.json(
        {
          success: true,
          data: { verification },
          error: null,
        },
        { status: 200 }
      );
    }

    const verification = await prisma.verification.create({
      data: {
        userId: user.id,
        type,
        documentUrl,
        status: "PENDING",
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "verification.submit",
      entity: "Verification",
      entityId: verification.id,
      metadata: { type },
      ipAddress: request.headers.get("x-forwarded-for") || undefined,
    });

    return Response.json(
      {
        success: true,
        data: { verification },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create verification error:", error);
    return Response.json(
      {
        success: false,
        data: null,
        error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
      },
      { status: 500 }
    );
  }
}
