import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { isDbUnavailable } from "@/lib/api-helpers";

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
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: { include: { profile: true } },
        },
      }),
      prisma.withdrawalRequest.count({ where }),
    ]);

    return Response.json({
      success: true,
      data: { withdrawals },
      error: null,
      meta: { timestamp: new Date().toISOString(), page, pageSize, total },
    });
  } catch (error) {
    console.error("Admin withdrawals error:", error);
    if (isDbUnavailable(error)) {
      return Response.json({ success: true, data: { withdrawals: [] }, error: null });
    }
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
