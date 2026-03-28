import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { sendEmail, verifyEmailTemplate } from "@/lib/email";
import { signupSchema } from "@/lib/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`signup:${ip}`, 3, 60 * 60 * 1000)) {
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

    const parsed = signupSchema.safeParse(body);
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

    const { email, password, name, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "EMAIL_EXISTS",
            message: "An account with this email already exists",
          },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const emailVerifyToken = crypto.randomUUID();

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        emailVerifyToken,
        role,
        profile: {
          create: {
            displayName: name,
          },
        },
      },
      include: { profile: true },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?token=${emailVerifyToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email - FundBD",
      html: verifyEmailTemplate(verifyUrl),
    });

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

    return Response.json(
      {
        success: true,
        data: { user: safeUser },
        error: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
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
