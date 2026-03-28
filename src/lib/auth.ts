import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

interface JWTPayload {
  userId: string;
  role: string;
}

export function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role } as JWTPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function getAuthUser(request?: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(request?: Request) {
  const user = await getAuthUser(request);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(role: string, request?: Request) {
  const user = await requireAuth(request);
  if (user.role !== role) {
    throw new Error("Forbidden");
  }
  return user;
}
