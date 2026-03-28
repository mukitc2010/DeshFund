import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Token is required",
          },
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired verification token",
          },
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
      },
    });

    return Response.json({
      success: true,
      data: { message: "Email verified successfully" },
      error: null,
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return Response.json(
      {
        success: false,
        data: null,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
