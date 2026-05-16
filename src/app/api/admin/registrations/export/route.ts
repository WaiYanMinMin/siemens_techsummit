import { NextResponse } from "next/server";

import { registrationsExportBuffer } from "@/lib/admin-excel";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("registrations")
      .select(
        "id, first_name, last_name, email, mobile_number, job_title, company, industry, breakout_track, challenges, need_timeline, consent, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(10000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const file = registrationsExportBuffer(data ?? []);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="registrations-export.xlsx"',
      },
    });
  } catch (error) {
    console.error("Admin registrations export error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
