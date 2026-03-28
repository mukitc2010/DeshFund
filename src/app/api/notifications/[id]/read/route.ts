import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PATCH(
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

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "Notification not found" },
        },
        { status: 404 }
      );
    }

    if (notification.userId !== user.id) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "Not your notification" },
        },
        { status: 403 }
      );
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return Response.json({
      success: true,
      data: { notification: updated },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
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
