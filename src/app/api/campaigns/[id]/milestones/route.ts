import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isDbUnavailable } from "@/lib/api-helpers";
import { getMockCampaign } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true },
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

    const milestones = await prisma.milestone.findMany({
      where: { campaignId: id },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json({
      success: true,
      data: { milestones },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Milestones list error:", error);
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
        data: { milestones: mock.milestones || [] },
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

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, founderId: true, goalAmount: true },
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

    if (campaign.founderId !== user.id && user.role !== "ADMIN") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only the campaign owner can create milestones" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, budgetAllocation, targetDate } = body;

    if (!title) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Title is required" },
        },
        { status: 400 }
      );
    }

    // Validate budget allocation doesn't exceed remaining
    if (budgetAllocation) {
      const existing = await prisma.milestone.aggregate({
        where: { campaignId: id },
        _sum: { budgetAllocation: true },
      });

      const currentTotal = Number(existing._sum.budgetAllocation || 0);
      const goalAmount = Number(campaign.goalAmount);
      const newAllocation = Number(budgetAllocation);

      if (currentTotal + newAllocation > goalAmount) {
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "VALIDATION_ERROR",
              message: `Budget allocation exceeds remaining amount. Available: ${goalAmount - currentTotal} BDT`,
            },
          },
          { status: 400 }
        );
      }
    }

    // Get next sort order
    const lastMilestone = await prisma.milestone.findFirst({
      where: { campaignId: id },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const milestone = await prisma.milestone.create({
      data: {
        campaignId: id,
        title,
        description: description || null,
        budgetAllocation: budgetAllocation ? parseFloat(budgetAllocation) : null,
        targetDate: targetDate ? new Date(targetDate) : null,
        sortOrder: (lastMilestone?.sortOrder ?? -1) + 1,
      },
    });

    return Response.json(
      {
        success: true,
        data: { milestone },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Milestone create error:", error);
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, founderId: true, goalAmount: true },
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

    if (campaign.founderId !== user.id && user.role !== "ADMIN") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only the campaign owner can update milestones" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { milestoneId, title, description, completionPct, status, budgetAllocation, targetDate } = body;

    if (!milestoneId) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "milestoneId is required" },
        },
        { status: 400 }
      );
    }

    const existing = await prisma.milestone.findFirst({
      where: { id: milestoneId, campaignId: id },
    });

    if (!existing) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Milestone not found" },
        },
        { status: 404 }
      );
    }

    // Validate budget if changed
    if (budgetAllocation !== undefined) {
      const agg = await prisma.milestone.aggregate({
        where: { campaignId: id, id: { not: milestoneId } },
        _sum: { budgetAllocation: true },
      });

      const otherTotal = Number(agg._sum.budgetAllocation || 0);
      const goalAmount = Number(campaign.goalAmount);

      if (otherTotal + Number(budgetAllocation) > goalAmount) {
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "VALIDATION_ERROR",
              message: `Budget allocation exceeds remaining amount. Available: ${goalAmount - otherTotal} BDT`,
            },
          },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completionPct !== undefined) updateData.completionPct = Math.max(0, Math.min(100, parseInt(completionPct, 10)));
    if (status !== undefined) updateData.status = status;
    if (budgetAllocation !== undefined) updateData.budgetAllocation = parseFloat(budgetAllocation);
    if (targetDate !== undefined) updateData.targetDate = targetDate ? new Date(targetDate) : null;

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: updateData,
    });

    return Response.json({
      success: true,
      data: { milestone },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Milestone update error:", error);
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get("milestoneId");

    if (!milestoneId) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "milestoneId is required" },
        },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.findFirst({
      where: { id: milestoneId, campaignId: id },
      include: { campaign: { select: { founderId: true } } },
    });

    if (!milestone) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Milestone not found" },
        },
        { status: 404 }
      );
    }

    if (milestone.campaign.founderId !== user.id && user.role !== "ADMIN") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only the campaign owner can delete milestones" },
        },
        { status: 403 }
      );
    }

    await prisma.milestone.delete({ where: { id: milestoneId } });

    return Response.json({
      success: true,
      data: null,
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Milestone delete error:", error);
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
