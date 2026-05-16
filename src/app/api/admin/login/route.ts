import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  getAdminSessionToken,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { password?: string };
    const password = payload.password?.trim() ?? "";

    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (!isValidAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, getAdminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
