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

    if (!action || !["approve", "reject"].includes(action)) {
      return Response.json(
        { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Action must be 'approve' or 'reject'" } },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!withdrawal) {
      return Response.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Withdrawal request not found" } },
        { status: 404 }
      );
    }

    if (withdrawal.status !== "PENDING") {
      return Response.json(
        { success: false, data: null, error: { code: "BAD_REQUEST", message: "Withdrawal is not pending" } },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      reviewedAt: new Date(),
    };

    if (action === "approve") {
      updateData.status = "APPROVED";
      if (notes) updateData.notes = notes;
    } else {
      updateData.status = "REJECTED";
      updateData.notes = notes || "Withdrawal rejected by admin";
    }

    const [updated] = await prisma.$transaction([
      prisma.withdrawalRequest.update({
        where: { id },
        data: updateData,
        include: { user: { include: { profile: true } } },
      }),
      prisma.notification.create({
        data: {
          userId: withdrawal.userId,
          title: action === "approve" ? "Withdrawal Approved" : "Withdrawal Rejected",
          message: action === "approve"
            ? `Your withdrawal request for BDT ${withdrawal.amount} has been approved.`
            : `Your withdrawal request for BDT ${withdrawal.amount} has been rejected. ${notes || ""}`,
          link: "/founder/withdrawals",
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: `withdrawal.${action}`,
          entity: "WithdrawalRequest",
          entityId: id,
          metadata: { notes: notes || null, amount: Number(withdrawal.amount) },
        },
      }),
    ]);

    return Response.json({
      success: true,
      data: { withdrawal: updated },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Withdrawal review error:", error);
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
