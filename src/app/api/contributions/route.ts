import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { isDbUnavailable } from "@/lib/api-helpers";

export async function GET(request: Request) {
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("pageSize") || "10", 10))
    );
    const skip = (page - 1) * pageSize;

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({
        where: { userId: user.id },
        include: {
          campaign: {
            select: {
              id: true,
              title: true,
              slug: true,
              coverImageUrl: true,
              status: true,
              goalAmount: true,
              raisedAmount: true,
            },
          },
          transaction: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.contribution.count({ where: { userId: user.id } }),
    ]);

    return Response.json({
      success: true,
      data: { contributions },
      error: null,
      meta: {
        timestamp: new Date().toISOString(),
        page,
        pageSize,
        total,
      },
    });
  } catch (error) {
    console.error("Contributions list error:", error);
    if (isDbUnavailable(error)) {
      return Response.json({ success: true, data: { contributions: [] }, error: null });
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
