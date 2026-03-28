import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
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

    const savedCampaigns = await prisma.savedCampaign.findMany({
      where: { userId: user.id },
      include: {
        campaign: {
          include: {
            founder: {
              include: {
                profile: {
                  select: { displayName: true, avatarUrl: true },
                },
                trustScore: {
                  select: { score: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      data: { savedCampaigns },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Saved campaigns list error:", error);
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

    const body = await request.json();
    const { campaignId } = body;

    if (!campaignId) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "campaignId is required" },
        },
        { status: 400 }
      );
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
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

    // Toggle: if exists, delete; if not, create
    const existing = await prisma.savedCampaign.findUnique({
      where: {
        userId_campaignId: {
          userId: user.id,
          campaignId,
        },
      },
    });

    if (existing) {
      await prisma.savedCampaign.delete({
        where: { id: existing.id },
      });

      return Response.json({
        success: true,
        data: { saved: false },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    await prisma.savedCampaign.create({
      data: {
        userId: user.id,
        campaignId,
      },
    });

    return Response.json(
      {
        success: true,
        data: { saved: true },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Save campaign error:", error);
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
