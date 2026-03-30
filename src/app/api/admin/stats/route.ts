import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { isDbUnavailable, mockAdminStats } from "@/lib/api-helpers";

export async function GET() {
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

    const [
      usersByRole,
      campaignsByStatus,
      contributionAgg,
      platformFeeAgg,
      pendingReviews,
      pendingWithdrawals,
      pendingVerifications,
      recentLogs,
    ] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: { id: true } }),
      prisma.campaign.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.contribution.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.$queryRaw<{ total: number }[]>`
        SELECT COALESCE(SUM(c.amount * camp."platformFee" / 100), 0)::float as total
        FROM "Contribution" c
        JOIN "Campaign" camp ON c."campaignId" = camp.id
        WHERE c.status = 'COMPLETED'
      `,
      prisma.campaign.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.withdrawalRequest.count({ where: { status: "PENDING" } }),
      prisma.verification.count({ where: { status: "PENDING" } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { include: { profile: true } } },
      }),
    ]);

    const roleCounts: Record<string, number> = {};
    for (const r of usersByRole) {
      roleCounts[r.role] = r._count.id;
    }

    const statusCounts: Record<string, number> = {};
    for (const s of campaignsByStatus) {
      statusCounts[s.status] = s._count.id;
    }

    const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);
    const totalCampaigns = Object.values(statusCounts).reduce((a, b) => a + b, 0);

    return Response.json({
      success: true,
      data: {
        users: { total: totalUsers, byRole: roleCounts },
        campaigns: { total: totalCampaigns, byStatus: statusCounts },
        contributions: {
          totalAmount: Number(contributionAgg._sum.amount || 0),
          count: contributionAgg._count.id,
        },
        platformFees: platformFeeAgg[0]?.total || 0,
        pendingReviews,
        pendingWithdrawals,
        pendingVerifications,
        recentActivity: recentLogs,
      },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    if (isDbUnavailable(error)) {
      return Response.json(mockAdminStats());
    }
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
