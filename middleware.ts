import { NextResponse, type NextRequest } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  CONFIRMATIONS_ADMIN_COOKIE_NAME,
  isAdminAuthenticatedCookie,
  isConfirmationsAuthenticatedCookie,
} from "@/lib/admin-auth";

function mainAdminAuthed(request: NextRequest) {
  const session = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return isAdminAuthenticatedCookie(session);
}

function confirmationsAuthed(request: NextRequest) {
  const session = request.cookies.get(CONFIRMATIONS_ADMIN_COOKIE_NAME)?.value;
  return isConfirmationsAuthenticatedCookie(session);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const confLoginPage = pathname === "/admin/confirmations/login";
  const confLoginApi = pathname === "/api/admin/confirmations/login";
  const confLogoutApi = pathname === "/api/admin/confirmations/logout";
  const isConfirmationsPage = pathname.startsWith("/admin/confirmations");
  const isConfirmationsApi = pathname.startsWith("/api/admin/confirmations");

  if (isConfirmationsPage || isConfirmationsApi) {
    const confOk = confirmationsAuthed(request);

    if (confLoginPage || confLoginApi || confLogoutApi) {
      if (confLoginPage && confOk) {
        return NextResponse.redirect(new URL("/admin/confirmations", request.url));
      }
      return NextResponse.next();
    }

    if (!confOk) {
      if (isConfirmationsApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const loginUrl = new URL("/admin/confirmations/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  const isLoginRoute = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const authed = mainAdminAuthed(request);

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
