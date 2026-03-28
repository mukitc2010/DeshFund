import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

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

    // Get top-level comments with replies
    const comments = await prisma.comment.findMany({
      where: { campaignId: id, parentId: null },
      include: {
        user: {
          include: {
            profile: {
              select: { displayName: true, avatarUrl: true },
            },
          },
        },
        replies: {
          include: {
            user: {
              include: {
                profile: {
                  select: { displayName: true, avatarUrl: true },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      data: { comments },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Comments list error:", error);
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
      select: { id: true, founderId: true, title: true },
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

    const body = await request.json();
    const { content, parentId } = body;

    if (!content || !content.trim()) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Content is required" },
        },
        { status: 400 }
      );
    }

    // Validate parentId if provided
    if (parentId) {
      const parent = await prisma.comment.findFirst({
        where: { id: parentId, campaignId: id },
      });
      if (!parent) {
        return Response.json(
          {
            success: false,
            data: null,
            error: { code: "NOT_FOUND", message: "Parent comment not found" },
          },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        campaignId: id,
        userId: user.id,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: {
          include: {
            profile: {
              select: { displayName: true, avatarUrl: true },
            },
          },
        },
      },
    });

    // Notify campaign owner (if commenter is not the owner)
    if (campaign.founderId !== user.id) {
      const displayName = user.profile?.displayName || user.email;
      await prisma.notification.create({
        data: {
          userId: campaign.founderId,
          title: "New comment on your campaign",
          message: `${displayName} commented on "${campaign.title}"`,
          link: `/campaigns/${id}`,
        },
      });
    }

    return Response.json(
      {
        success: true,
        data: { comment },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment create error:", error);
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
