import { NextResponse } from "next/server";

import { parseRegistrationRows, parseWorkbookRows } from "@/lib/admin-excel";
import { toRegistrationInsertPayload } from "@/lib/admin-registration";
import { sendRegistrationConfirmation } from "@/lib/email";
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
    let emailsSent = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const { data, error } = await supabase
        .from("registrations")
        .insert(toRegistrationInsertPayload(row))
        .select("id")
        .single();

      if (error || !data?.id) {
        failed += 1;
        errors.push(`${row.email}: ${error?.message ?? "Could not insert record."}`);
        continue;
      }

      imported += 1;

      const confirmation = await sendRegistrationConfirmation({
        firstName: row.firstName,
        email: row.email,
        registrationId: String(data.id),
      });

      if (confirmation.ok) {
        emailsSent += 1;
      } else {
        errors.push(`${row.email}: confirmation email failed (${confirmation.error})`);
      }
    }

    return NextResponse.json({
      message: "Import completed.",
      totalRows: rows.length,
      imported,
      failed,
      emailsSent,
      errors,
    });
  } catch (error) {
    console.error("Admin registrations import error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
