import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Allow unrestricted access to auth routes/api and static Next.js assets
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // If user is not authenticated and trying to access a protected route (which is everything except auth)
  // For demonstration, we allow the homepage ('/') to be public so they can see the Hero section and log in
  if (!token && pathname !== "/" && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access panitia-only apps
  if (pathname.startsWith("/oho") || pathname.startsWith("/rally")) {
    if (token?.role !== "panitia") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
