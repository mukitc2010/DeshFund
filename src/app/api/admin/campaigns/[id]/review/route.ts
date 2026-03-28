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
    const { action, reason } = body as { action: string; reason?: string };

    if (!action || !["approve", "reject"].includes(action)) {
      return Response.json(
        { success: false, data: null, error: { code: "VALIDATION_ERROR", message: "Action must be 'approve' or 'reject'" } },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: { founder: true },
    });

    if (!campaign) {
      return Response.json(
        { success: false, data: null, error: { code: "NOT_FOUND", message: "Campaign not found" } },
        { status: 404 }
      );
    }

    if (campaign.status !== "PENDING_REVIEW") {
      return Response.json(
        { success: false, data: null, error: { code: "BAD_REQUEST", message: "Campaign is not pending review" } },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    let notificationTitle: string;
    let notificationMessage: string;

    if (action === "approve") {
      updateData.status = "ACTIVE";
      if (!campaign.startDate) {
        updateData.startDate = new Date();
      }
      notificationTitle = "Campaign Approved";
      notificationMessage = `Your campaign "${campaign.title}" has been approved and is now live.`;
    } else {
      updateData.status = "REJECTED";
      updateData.rejectionReason = reason || "No reason provided";
      notificationTitle = "Campaign Rejected";
      notificationMessage = `Your campaign "${campaign.title}" has been rejected. Reason: ${reason || "No reason provided"}`;
    }

    const [updated] = await prisma.$transaction([
      prisma.campaign.update({
        where: { id },
        data: updateData,
        include: {
          founder: { include: { profile: true } },
          milestones: { orderBy: { sortOrder: "asc" } },
        },
      }),
      prisma.notification.create({
        data: {
          userId: campaign.founderId,
          title: notificationTitle,
          message: notificationMessage,
          link: `/founder/campaigns/${campaign.id}`,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: `campaign.${action}`,
          entity: "Campaign",
          entityId: id,
          metadata: { reason: reason || null },
        },
      }),
    ]);

    return Response.json({
      success: true,
      data: { campaign: updated },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Campaign review error:", error);
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
