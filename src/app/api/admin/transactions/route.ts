import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

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
    const provider = searchParams.get("provider");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (provider) where.provider = provider;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          contribution: {
            include: {
              user: { include: { profile: true } },
              campaign: { select: { id: true, title: true, slug: true } },
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return Response.json({
      success: true,
      data: { transactions },
      error: null,
      meta: { timestamp: new Date().toISOString(), page, pageSize, total },
    });
  } catch (error) {
    console.error("Admin transactions error:", error);
    return Response.json(
      { success: false, data: null, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
