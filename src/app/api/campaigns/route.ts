import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { createCampaignSchema, campaignQuerySchema } from "@/lib/validators/campaign";
import { Prisma } from "@/generated/prisma/client";
import { isDbUnavailable, mockCampaignList } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryInput = {
      page: searchParams.get("page") || undefined,
      pageSize: searchParams.get("pageSize") || undefined,
      status: searchParams.get("status") || undefined,
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      sort: searchParams.get("sort") || undefined,
      featured: searchParams.get("featured") || undefined,
    };

    const parsed = campaignQuerySchema.safeParse(queryInput);
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

    const { page, pageSize, status, category, search, sort, featured } = parsed.data;
    const user = await getAuthUser();

    const where: Prisma.CampaignWhereInput = {};

    // Visibility rules
    if (user && user.role === "FOUNDER") {
      // Founders can see public campaigns + their own in any status
      if (status) {
        where.OR = [
          { status: status as Prisma.EnumCampaignStatusFilter["equals"], founderId: user.id },
          { AND: [{ status: status as Prisma.EnumCampaignStatusFilter["equals"] }, { status: { in: ["ACTIVE", "FUNDED"] } }] },
        ];
      } else {
        where.OR = [
          { founderId: user.id },
          { status: { in: ["ACTIVE", "FUNDED"] } },
        ];
      }
    } else if (user && user.role === "ADMIN") {
      // Admins can see all; optionally filter by status
      if (status) {
        where.status = status as Prisma.EnumCampaignStatusFilter["equals"];
      }
    } else {
      // Public: only ACTIVE and FUNDED
      where.status = { in: ["ACTIVE", "FUNDED"] };
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { tagline: { contains: search, mode: "insensitive" } },
          ],
        },
      ];
    }

    if (featured) {
      where.isFeatured = true;
    }

    const orderBy: Prisma.CampaignOrderByWithRelationInput =
      sort === "funded"
        ? { raisedAmount: "desc" }
        : sort === "trending"
          ? { contributorCount: "desc" }
          : { createdAt: "desc" };

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          founder: {
            include: { profile: true },
          },
          _count: {
            select: { contributions: true },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return Response.json({
      success: true,
      data: { campaigns },
      error: null,
      meta: {
        page,
        pageSize,
        total,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Campaign list error:", error);
    if (isDbUnavailable(error)) {
      const searchParams = request.nextUrl.searchParams;
      const parsed = campaignQuerySchema.safeParse({
        page: searchParams.get("page") || undefined,
        pageSize: searchParams.get("pageSize") || undefined,
        category: searchParams.get("category") || undefined,
        search: searchParams.get("search") || undefined,
        sort: searchParams.get("sort") || undefined,
        featured: searchParams.get("featured") || undefined,
      });
      const { page = 1, pageSize = 12, category, search, sort, featured } = parsed.success ? parsed.data : {} as Record<string, undefined>;
      return Response.json(mockCampaignList({ page, pageSize, category, search, sort, featured: !!featured }));
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

    if (user.role !== "FOUNDER") {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Only founders can create campaigns" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createCampaignSchema.safeParse(body);
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

    const { title, tagline, description, category, goalAmount, startDate, endDate, coverImageUrl, videoUrl } = parsed.data;

    // Generate unique slug
    let slug = slugify(title);
    const existingSlug = await prisma.campaign.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const campaign = await prisma.campaign.create({
      data: {
        founderId: user.id,
        title,
        slug,
        tagline,
        description,
        category,
        goalAmount,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        coverImageUrl,
        videoUrl,
        status: "DRAFT",
      },
      include: {
        founder: {
          include: { profile: true },
        },
      },
    });

    return Response.json(
      {
        success: true,
        data: { campaign },
        error: null,
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Campaign create error:", error);
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
