import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { updateCampaignSchema } from "@/lib/validators/campaign";
import { isDbUnavailable, mockCampaignDetail } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        founder: {
          include: {
            profile: true,
            trustScore: true,
          },
        },
        milestones: {
          orderBy: { sortOrder: "asc" },
        },
        metrics: {
          orderBy: { period: "desc" },
          take: 12,
        },
        documents: true,
        updates: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            contributions: true,
            comments: true,
          },
        },
      },
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

    // Visibility check: non-active/funded campaigns only visible to owner or admin
    const isPublicStatus = campaign.status === "ACTIVE" || campaign.status === "FUNDED";
    const isOwner = user?.id === campaign.founderId;
    const isAdmin = user?.role === "ADMIN";

    if (!isPublicStatus && !isOwner && !isAdmin) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Campaign not found" },
        },
        { status: 404 }
      );
    }

    // Filter documents based on access
    let filteredDocuments = campaign.documents;
    if (!isOwner && !isAdmin) {
      filteredDocuments = campaign.documents.filter(
        (doc: any) => doc.visibility === "PUBLIC"
      );
    }

    return Response.json({
      success: true,
      data: { campaign: { ...campaign, documents: filteredDocuments } },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Campaign detail error:", error);
    if (isDbUnavailable(error)) {
      const { id } = await params;
      const mock = mockCampaignDetail(id);
      if (!mock) {
        return Response.json(
          { success: false, data: null, error: { code: "NOT_FOUND", message: "Campaign not found" } },
          { status: 404 }
        );
      }
      return Response.json(mock);
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

export async function PATCH(
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

    const campaign = await prisma.campaign.findUnique({ where: { id } });
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
          error: { code: "FORBIDDEN", message: "You can only edit your own campaigns" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = updateCampaignSchema.safeParse(body);
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

    const data = parsed.data;

    // If requesting status change to PENDING_REVIEW, validate required fields
    if (body.status === "PENDING_REVIEW") {
      const current = { ...campaign, ...data };
      if (!current.title || !current.tagline || !current.description || !current.category || !current.goalAmount) {
        return Response.json(
          {
            success: false,
            data: null,
            error: {
              code: "VALIDATION_ERROR",
              message: "Campaign must have title, tagline, description, category, and goal amount before submitting for review",
            },
          },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = { ...data };
    if (body.status) {
      updateData.status = body.status;
    }
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }

    const updated = await prisma.campaign.update({
      where: { id },
      data: updateData,
      include: {
        founder: {
          include: { profile: true },
        },
      },
    });

    return Response.json({
      success: true,
      data: { campaign: updated },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Campaign update error:", error);
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

    const campaign = await prisma.campaign.findUnique({ where: { id } });
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
          error: { code: "FORBIDDEN", message: "You can only delete your own campaigns" },
        },
        { status: 403 }
      );
    }

    if (campaign.status !== "DRAFT") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "BAD_REQUEST", message: "Only draft campaigns can be deleted" },
        },
        { status: 400 }
      );
    }

    await prisma.campaign.delete({ where: { id } });

    return Response.json({
      success: true,
      data: { message: "Campaign deleted successfully" },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Campaign delete error:", error);
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
