import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("invitation_recipients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invitations: data ?? [] });
  } catch (error) {
    console.error("Admin invitations GET error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
