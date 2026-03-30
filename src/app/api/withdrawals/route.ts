import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { withdrawalSchema } from "@/lib/validators/contribution";
import { isDbUnavailable } from "@/lib/api-helpers";


export async function GET(request: Request) {
  try {
    let user;
    try {
      user = await requireRole("FOUNDER");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication required";
      const code = message === "Forbidden" ? "FORBIDDEN" : "UNAUTHORIZED";
      const status = code === "FORBIDDEN" ? 403 : 401;
      return Response.json(
        {
          success: false,
          data: null,
          error: { code, message },
        },
        { status }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where: { userId: user.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: { select: { displayName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.withdrawalRequest.count({ where: { userId: user.id } }),
    ]);

    // Enrich with campaign titles
    const campaignIds = [...new Set(withdrawals.map((w: any) => w.campaignId))];
    const campaigns = await prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
      select: { id: true, title: true, slug: true },
    });
    const campaignMap = new Map(campaigns.map((c) => [c.id, c]));

    const enriched = withdrawals.map((w) => ({
      ...w,
      campaign: campaignMap.get(w.campaignId) || null,
    }));

    return Response.json({
      success: true,
      data: { withdrawals: enriched },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        page,
        pageSize,
        total,
      },
    });
  } catch (error) {
    console.error("Withdrawals list error:", error);
    if (isDbUnavailable(error)) {
      return Response.json({ success: true, data: { withdrawals: [] }, error: null });
    }
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
    let user;
    try {
      user = await requireRole("FOUNDER");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Authentication required";
      const code = message === "Forbidden" ? "FORBIDDEN" : "UNAUTHORIZED";
      const status = code === "FORBIDDEN" ? 403 : 401;
      return Response.json(
        {
          success: false,
          data: null,
          error: { code, message },
        },
        { status }
      );
    }

    const body = await request.json();
    const parsed = withdrawalSchema.safeParse(body);
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

    const { campaignId, amount, provider, accountInfo, notes } = parsed.data;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Campaign not found" },
        },
        { status: 404 }
      );
    }

    if (campaign.founderId !== user.id) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "FORBIDDEN",
            message: "You can only withdraw from your own campaigns",
          },
        },
        { status: 403 }
      );
    }

    // Calculate available balance
    // Sum of existing non-rejected withdrawals
    const existingWithdrawals = await prisma.withdrawalRequest.aggregate({
      where: {
        campaignId,
        status: { in: ["PENDING", "APPROVED", "PROCESSING", "COMPLETED"] },
      },
      _sum: { amount: true },
    });

    const totalWithdrawn = Number(existingWithdrawals._sum.amount || 0);
    const raisedAmount = Number(campaign.raisedAmount);
    const availableBalance = raisedAmount - totalWithdrawn;

    if (amount > availableBalance) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "INSUFFICIENT_BALANCE",
            message: `Available balance is ৳${availableBalance.toFixed(2)}. Requested ৳${amount.toFixed(2)}.`,
          },
        },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId: user.id,
        campaignId,
        amount,
        status: "PENDING",
        provider: provider as
          | "BKASH"
          | "NAGAD"
          | "ROCKET"
          | "SSLCOMMERZ"
          | "CARD"
          | undefined,
        accountInfo: accountInfo ? JSON.parse(JSON.stringify(accountInfo)) : undefined,
        notes: notes || undefined,
      },
    });

    return Response.json(
      {
        success: true,
        data: {
          withdrawal,
          availableBalance: availableBalance - amount,
        },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Withdrawal create error:", error);
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
