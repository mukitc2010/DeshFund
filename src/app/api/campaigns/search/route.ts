import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDbUnavailable, mockSearch } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");

    if (!q || q.trim().length === 0) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "Search query is required" },
        },
        { status: 400 }
      );
    }

    const results = await prisma.campaign.findMany({
      where: {
        status: { in: ["ACTIVE", "FUNDED"] },
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { tagline: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        founder: {
          include: { profile: true },
        },
      },
    });

    return Response.json({
      success: true,
      data: { results },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Campaign search error:", error);
    if (isDbUnavailable(error)) {
      const q = request.nextUrl.searchParams.get("q") || "";
      return Response.json(mockSearch(q));
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
