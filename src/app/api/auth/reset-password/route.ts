import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { sendEmail, resetPasswordTemplate } from "@/lib/email";
import {
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(`reset-password:${ip}`, 3, 60 * 60 * 1000)) {
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

    // Case 1: Request password reset (email only)
    if (body.email && !body.token) {
      const parsed = resetPasswordRequestSchema.safeParse(body);
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

      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });

      // Always return success to prevent email enumeration
      if (!user) {
        return Response.json({
          success: true,
          data: { message: "If an account exists, a reset link has been sent" },
          error: null,
        });
      }

      const resetToken = crypto.randomUUID();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
      });

      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: "Reset your password - FundBD",
        html: resetPasswordTemplate(resetUrl),
      });

      return Response.json({
        success: true,
        data: { message: "If an account exists, a reset link has been sent" },
        error: null,
      });
    }

    // Case 2: Reset password with token
    const parsed = resetPasswordSchema.safeParse(body);
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

    const { token, password } = parsed.data;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: {
            code: "INVALID_TOKEN",
            message: "Invalid or expired reset token",
          },
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return Response.json({
      success: true,
      data: { message: "Password reset successfully" },
      error: null,
    });
  } catch (error) {
    console.error("Reset password error:", error);
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
