import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { comparePassword } from "@/lib/password";
import { loginSchema } from "@/lib/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "RATE_LIMITED",
            message: "Too many attempts. Please try again later.",
          },
        },
        { status: 429 }
      );
    }
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.issues[0].message,
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    const token = signToken(user.id, user.role);

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const { passwordHash: _, emailVerifyToken: __, resetToken: ___, resetTokenExpiry: ____, ...safeUser } = user;

    return Response.json({
      success: true,
      data: { user: safeUser },
      error: null,
    });
  } catch (error) {
    console.error("Login error:", error);
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
