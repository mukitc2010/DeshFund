import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { isDbUnavailable } from "@/lib/api-helpers";
import { MOCK_USERS } from "@/lib/mock-data";

export async function GET(request: Request) {
  try {
    try {
      await requireRole("ADMIN");
    } catch {
      return Response.json(
        { success: false, data: null, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (role && ["FOUNDER", "SUPPORTER", "ADMIN"].includes(role)) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { profile: { displayName: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          profile: true,
          trustScore: true,
          _count: {
            select: { campaigns: true, contributions: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    const sanitized = users.map(({ passwordHash, resetToken, resetTokenExpiry, emailVerifyToken, ...u }: any) => u);

    return Response.json({
      success: true,
      data: { users: sanitized },
      error: null,
      meta: { timestamp: new Date().toISOString(), page, pageSize, total },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    if (isDbUnavailable(error)) {
      return Response.json({
        success: true,
        data: { users: MOCK_USERS },
        error: null,
        meta: { timestamp: new Date().toISOString(), page: 1, pageSize: 20, total: MOCK_USERS.length },
      });
    }
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
