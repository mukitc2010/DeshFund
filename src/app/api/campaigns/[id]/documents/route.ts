import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { DOCUMENT_TYPES } from "@/lib/upload";
import { isDbUnavailable } from "@/lib/api-helpers";
import { getMockCampaign } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();

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

    const isOwnerOrAdmin =
      user && (user.id === campaign.founderId || user.role === "ADMIN");

    const documents = await prisma.document.findMany({
      where: {
        campaignId: id,
        ...(!isOwnerOrAdmin ? { visibility: "PUBLIC" } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({
      success: true,
      data: { documents },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Documents list error:", error);
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
        data: { documents: mock.documents || [] },
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
          error: { code: "FORBIDDEN", message: "Only the campaign owner can upload documents" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, type, fileUrl, fileSize, visibility } = body;

    if (!name || !type || !fileUrl) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Name, type, and fileUrl are required" },
        },
        { status: 400 }
      );
    }

    if (!DOCUMENT_TYPES.includes(type)) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Invalid document type" },
        },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        campaignId: id,
        name,
        type,
        fileUrl,
        fileSize: fileSize ? parseInt(fileSize, 10) : null,
        visibility: visibility || "PUBLIC",
      },
    });

    // Update trust score - docsUploaded
    await prisma.trustScore.upsert({
      where: { userId: user.id },
      update: { docsUploaded: true },
      create: {
        userId: user.id,
        docsUploaded: true,
        score: 10,
      },
    });

    return Response.json(
      {
        success: true,
        data: { document },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Document create error:", error);
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
    const docId = searchParams.get("docId");

    if (!docId) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "docId is required" },
        },
        { status: 400 }
      );
    }

    const document = await prisma.document.findFirst({
      where: { id: docId, campaignId: id },
      include: { campaign: { select: { founderId: true } } },
    });

    if (!document) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Document not found" },
        },
        { status: 404 }
      );
    }

    if (document.campaign.founderId !== user.id && user.role !== "ADMIN") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only the campaign owner can delete documents" },
        },
        { status: 403 }
      );
    }

    await prisma.document.delete({ where: { id: docId } });

    return Response.json({
      success: true,
      data: null,
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Document delete error:", error);
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
