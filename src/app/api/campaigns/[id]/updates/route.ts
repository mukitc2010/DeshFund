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

    const updates = await prisma.campaignUpdate.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      data: { updates },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Updates list error:", error);
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
        data: { updates: mock.updates || [] },
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

    if (campaign.founderId !== user.id && user.role !== "ADMIN") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only the campaign owner can post updates" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Title and content are required" },
        },
        { status: 400 }
      );
    }

    const update = await prisma.campaignUpdate.create({
      data: {
        campaignId: id,
        title,
        content,
      },
    });

    // Update trust score - updatesPosted
    await prisma.trustScore.upsert({
      where: { userId: user.id },
      update: { updatesPosted: true },
      create: {
        userId: user.id,
        updatesPosted: true,
        score: 10,
      },
    });

    return Response.json(
      {
        success: true,
        data: { update },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Update create error:", error);
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
