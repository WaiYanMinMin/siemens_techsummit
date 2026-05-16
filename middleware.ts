import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME, isAdminAuthenticatedCookie } from "@/lib/admin-auth";

function isAuthenticated(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminAuthenticatedCookie(session);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const authed = isAuthenticated(request);

  if ((isLoginRoute || isLoginApi) && authed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isLoginRoute || isLoginApi) {
    return NextResponse.next();
  }

  if (authed) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
