import { prisma } from "@/lib/prisma";
import { isDbUnavailable, mockFeatured } from "@/lib/api-helpers";

export async function GET() {
  try {
    const [featured, recentlyFunded] = await Promise.all([
      prisma.campaign.findMany({
        where: {
          isFeatured: true,
          status: "ACTIVE",
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          founder: {
            include: { profile: true },
          },
        },
      }),
      prisma.campaign.findMany({
        where: {
          status: "FUNDED",
        },
        take: 4,
        orderBy: { updatedAt: "desc" },
        include: {
          founder: {
            include: { profile: true },
          },
        },
      }),
    ]);

    return Response.json({
      success: true,
      data: { featured, recentlyFunded },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Featured campaigns error:", error);
    if (isDbUnavailable(error)) {
      return Response.json(mockFeatured());
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
