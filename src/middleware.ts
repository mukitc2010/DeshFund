import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple middleware -- verify JWT exists for protected routes
// Detailed role checks happen in API routes themselves
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protected dashboard routes
  const protectedPaths = ["/founder", "/supporter", "/admin"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/founder/:path*", "/supporter/:path*", "/admin/:path*"],
};
