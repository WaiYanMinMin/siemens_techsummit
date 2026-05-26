import { NextResponse } from "next/server";

import { parseRegistrationRows, parseWorkbookRows } from "@/lib/admin-excel";
import { toRegistrationInsertPayload } from "@/lib/admin-registration";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const workbookRows = parseWorkbookRows(await file.arrayBuffer());
    const rows = parseRegistrationRows(workbookRows);

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const { error } = await supabase
        .from("registrations")
        .insert(toRegistrationInsertPayload(row))
        .select("id")
        .single();

      if (error) {
        failed += 1;
        errors.push(`${row.email}: ${error.message}`);
        continue;
      }

      imported += 1;
    }

    return NextResponse.json({
      message: "Registration import completed.",
      totalRows: rows.length,
      imported,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Admin registrations import error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
