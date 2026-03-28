import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          },
        },
        { status: 401 }
      );
    }

    const { passwordHash: _, emailVerifyToken: __, resetToken: ___, resetTokenExpiry: ____, ...safeUser } = user;

    return Response.json({
      success: true,
      data: { user: safeUser },
      error: null,
    });
  } catch (error) {
    console.error("Me error:", error);
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
