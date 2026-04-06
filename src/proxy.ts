import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Proxy handles middleware logic for Next.js 16+
 * It protects routes and handles role-based redirection.
 */
export default async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // 1. Allow unrestricted access to auth APIs and internal Next.js assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Protect all routes: If not logged in, redirect to /login
  // (Access to /login itself is handled by the matcher exclusion or explicit check)
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role-Based Access Control (RBAC)
  // Restricted routes for 'panitia' only
  const isRestrictedPath =
    pathname.startsWith("/oho") || pathname.startsWith("/rally");

  if (isRestrictedPath && token?.role !== "panitia") {
    // Redirect authenticated 'mahasiswa' to dashboard with error param
    return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Protect all routes except internal Next.js paths, auth APIs, and the login page
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};
