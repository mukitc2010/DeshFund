import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { metricSchema } from "@/lib/validators/metric";
import { isDbUnavailable } from "@/lib/api-helpers";
import { getMockCampaign } from "@/lib/mock-data";

interface MetricRow {
  id: string;
  campaignId: string;
  period: string;
  revenue: unknown;
  profit: unknown;
  customers: number | null;
  users: number | null;
  orders: number | null;
  expenses: unknown;
  cashFlow: unknown;
  teamSize: number | null;
  createdAt: Date;
  updatedAt: Date;
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function growthPct(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 10000) / 100;
}

function computeGrowthFields(metrics: MetricRow[]) {
  const sorted = [...metrics].sort((a, b) => a.period.localeCompare(b.period));
  const periodMap = new Map<string, MetricRow>();
  for (const m of sorted) {
    periodMap.set(m.period, m);
  }

  return sorted.map((m) => {
    const [yearStr, monthStr] = m.period.split("-");
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    // Previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevPeriod = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;
    const prev = periodMap.get(prevPeriod);

    // Same month last year
    const yoyPeriod = `${year - 1}-${monthStr}`;
    const yoy = periodMap.get(yoyPeriod);

    const revenue = toNum(m.revenue);
    const users = toNum(m.users);
    const customers = m.customers;

    return {
      ...m,
      revenue: toNum(m.revenue),
      profit: toNum(m.profit),
      expenses: toNum(m.expenses),
      cashFlow: toNum(m.cashFlow),
      mom: {
        revenue: growthPct(revenue, prev ? toNum(prev.revenue) : null),
        users: growthPct(users, prev ? toNum(prev.users) : null),
        customers: growthPct(customers, prev ? prev.customers : null),
      },
      yoy: {
        revenue: growthPct(revenue, yoy ? toNum(yoy.revenue) : null),
        users: growthPct(users, yoy ? toNum(yoy.users) : null),
        customers: growthPct(customers, yoy ? yoy.customers : null),
      },
    };
  });
}

function computeSummary(enriched: ReturnType<typeof computeGrowthFields>) {
  if (enriched.length === 0) {
    return { bestMonth: null, trendDirection: "neutral", avgMonthlyGrowth: null };
  }

  // Best month by revenue
  let bestMonth: { period: string; revenue: number } | null = null;
  for (const m of enriched) {
    if (m.revenue !== null && (bestMonth === null || m.revenue > bestMonth.revenue)) {
      bestMonth = { period: m.period, revenue: m.revenue };
    }
  }

  // Average monthly revenue growth
  const revenueGrowths = enriched
    .map((m) => m.mom.revenue)
    .filter((g): g is number => g !== null);
  const avgMonthlyGrowth =
    revenueGrowths.length > 0
      ? Math.round((revenueGrowths.reduce((a, b) => a + b, 0) / revenueGrowths.length) * 100) / 100
      : null;

  // Trend direction based on last 3 months revenue
  const last3 = enriched.slice(-3);
  let trendDirection: "up" | "down" | "neutral" = "neutral";
  if (last3.length >= 2) {
    const first = last3[0].revenue;
    const last = last3[last3.length - 1].revenue;
    if (first !== null && last !== null) {
      if (last > first) trendDirection = "up";
      else if (last < first) trendDirection = "down";
    }
  }

  return { bestMonth, trendDirection, avgMonthlyGrowth };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, status: true, founderId: true },
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

    const isPublic = campaign.status === "ACTIVE" || campaign.status === "FUNDED";
    if (!isPublic) {
      const user = await getAuthUser();
      const isOwner = user?.id === campaign.founderId;
      const isAdmin = user?.role === "ADMIN";
      if (!isOwner && !isAdmin) {
        return Response.json(
          {
            success: false,
            data: null,
            error: { code: "NOT_FOUND", message: "Campaign not found" },
          },
          { status: 404 }
        );
      }
    }

    const metrics = await prisma.metric.findMany({
      where: { campaignId: id },
      orderBy: { period: "asc" },
    });

    const enriched = computeGrowthFields(metrics as MetricRow[]);
    const summary = computeSummary(enriched);

    return Response.json({
      success: true,
      data: { metrics: enriched, summary },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Metrics GET error:", error);
    if (isDbUnavailable(error)) {
      const { id } = await params;
      const mock = getMockCampaign(id);
      if (!mock) {
        return Response.json(
          { success: false, data: null, error: { code: "NOT_FOUND", message: "Campaign not found" } },
          { status: 404 }
        );
      }
      return Response.json({
        success: true,
        data: { metrics: mock.metrics || [], summary: { bestMonth: null, trendDirection: "neutral", avgMonthlyGrowth: null } },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      });
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let user;
    try {
      user = await requireAuth();
    } catch {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "UNAUTHORIZED", message: "Authentication required" },
        },
        { status: 401 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, founderId: true },
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
          error: { code: "FORBIDDEN", message: "Only the campaign owner can add metrics" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = metricSchema.safeParse(body);
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

    const { period, revenue, profit, customers, users, orders, expenses, cashFlow, teamSize } =
      parsed.data;

    const metricData = {
      period,
      revenue: revenue ?? null,
      profit: profit ?? null,
      customers: customers ?? null,
      users: users ?? null,
      orders: orders ?? null,
      expenses: expenses ?? null,
      cashFlow: cashFlow ?? null,
      teamSize: teamSize ?? null,
    };

    const metric = await prisma.metric.upsert({
      where: {
        campaignId_period: {
          campaignId: id,
          period,
        },
      },
      create: {
        campaignId: id,
        ...metricData,
      },
      update: metricData,
    });

    // Recalculate trust score: set financialData = true since metrics now exist
    const existingScore = await prisma.trustScore.findUnique({
      where: { userId: user.id },
    });

    if (existingScore) {
      let score = 0;
      if (existingScore.kycComplete) score += 25;
      if (existingScore.revenueVerified) score += 20;
      if (existingScore.businessReg) score += 20;
      if (existingScore.teamListed) score += 5;
      score += 5; // financialData is now true
      if (existingScore.updatesPosted) score += 3;
      if (existingScore.docsUploaded) score += 2;
      score = Math.min(100, score);

      await prisma.trustScore.update({
        where: { userId: user.id },
        data: { financialData: true, score },
      });
    } else {
      await prisma.trustScore.create({
        data: {
          userId: user.id,
          financialData: true,
          score: 5,
        },
      });
    }

    return Response.json({
      success: true,
      data: { metric },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Metrics POST error:", error);
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
