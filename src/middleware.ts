import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

/**
 * Route permission rules. Each entry maps a path prefix to the
 * set of permissions that grant access (OR logic — any one suffices).
 * More specific routes are listed first and checked before the
 * general `/admin` catch-all.
 */
const routePermissions: { path: string; anyOf: string[] }[] = [
  {
    path: "/admin/attendance",
    anyOf: ["page_AttendanceRecording", "page_AttendanceReport"],
  },
  {
    path: "/admin/violations",
    anyOf: ["page_ViolationRecording", "page_ViolationReport"],
  },
  {
    path: "/admin",
    anyOf: ["access_admin_panel"],
  },
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow unrestricted access to auth APIs, Next.js internals, and static assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // 2. Allow unauthenticated access to /login only
  if (!token) {
    if (pathname === "/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Prevent authenticated users from visiting /login
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Permission-based route guards
  const userPermissions = (token.permissions ?? []) as string[];

  for (const rule of routePermissions) {
    if (pathname === rule.path || pathname.startsWith(`${rule.path}/`)) {
      const hasPermission = rule.anyOf.some((perm) =>
        userPermissions.includes(perm)
      );
      if (!hasPermission) {
        return NextResponse.redirect(
          new URL("/?error=unauthorized", request.url)
        );
      }
      // Don't break — continue checking broader rules (e.g. /admin after /admin/attendance)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     * The middleware function itself also guards specific paths above.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
