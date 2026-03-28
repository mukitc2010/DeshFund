import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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
