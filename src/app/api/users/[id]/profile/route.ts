import { prisma } from "@/lib/prisma";
import { getAuthUser, requireAuth } from "@/lib/auth";
import { isDbUnavailable, mockUserProfile } from "@/lib/api-helpers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        trustScore: true,
        campaigns: {
          where: {
            status: { in: ["ACTIVE", "FUNDED"] },
          },
          include: {
            _count: {
              select: { contributions: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "NOT_FOUND", message: "User not found" },
        },
        { status: 404 }
      );
    }

    // Strip sensitive fields
    const { passwordHash, resetToken, resetTokenExpiry, emailVerifyToken, ...safeUser } = user;

    return Response.json({
      success: true,
      data: { user: safeUser },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("User profile GET error:", error);
    if (isDbUnavailable(error)) {
      const { id } = await params;
      const mock = mockUserProfile(id);
      if (!mock) {
        return Response.json(
          { success: false, data: null, error: { code: "NOT_FOUND", message: "User not found" } },
          { status: 404 }
        );
      }
      return Response.json(mock);
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let authUser;
    try {
      authUser = await requireAuth();
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

    if (authUser.id !== id) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "FORBIDDEN", message: "You can only update your own profile" },
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Only allow specific fields
    const allowedFields = [
      "displayName",
      "bio",
      "phone",
      "location",
      "website",
      "linkedin",
      "companyName",
      "companyRole",
      "avatarUrl",
      "nidNumber",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Prevent NID change if already verified
    if ("nidNumber" in updateData) {
      const nidVerification = await prisma.verification.findUnique({
        where: { userId_type: { userId: id, type: "NID" } },
      });
      if (nidVerification?.status === "VERIFIED") {
        delete updateData.nidNumber;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        {
          success: false,
          data: null,
          error: { code: "VALIDATION_ERROR", message: "No valid fields to update" },
        },
        { status: 400 }
      );
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: id },
      update: updateData,
      create: {
        userId: id,
        displayName: (updateData.displayName as string) || authUser.email,
        ...updateData,
      },
    });

    return Response.json({
      success: true,
      data: { profile: updatedProfile },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error("User profile PATCH error:", error);
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
