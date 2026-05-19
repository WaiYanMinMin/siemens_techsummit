import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { CONFIRMATIONS_ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(CONFIRMATIONS_ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Confirmations admin logout error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
