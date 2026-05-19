import { NextResponse } from "next/server";

import {
  parseConfirmationSendRows,
  parseWorkbookRows,
} from "@/lib/admin-excel";
import { sendRegistrationConfirmation } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbookRows = parseWorkbookRows(buffer);
    const rows = parseConfirmationSendRows(workbookRows);

    const supabase = getSupabaseAdminClient();
    let processed = 0;
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      processed += 1;
      const label = row.email || row.registrationId;

      const { data: reg, error: fetchError } = await supabase
        .from("registrations")
        .select("id, first_name, last_name, email, approval_status")
        .eq("id", row.registrationId)
        .maybeSingle();

      if (fetchError) {
        failed += 1;
        errors.push(`${label}: ${fetchError.message}`);
        continue;
      }

      if (!reg) {
        failed += 1;
        errors.push(`${label}: no registration found for registration_id.`);
        continue;
      }

      if (reg.approval_status !== "approved") {
        failed += 1;
        errors.push(
          `${reg.email}: registration is not approved (status: ${reg.approval_status ?? "unknown"}).`,
        );
        continue;
      }

      if (row.email && reg.email.toLowerCase() !== row.email) {
        failed += 1;
        errors.push(
          `${reg.email}: email in file does not match registration (expected ${reg.email}).`,
        );
        continue;
      }

      const { error: updateError } = await supabase
        .from("registrations")
        .update({ ticket_id: row.ticketId.trim() })
        .eq("id", reg.id);

      if (updateError) {
        failed += 1;
        errors.push(`${reg.email}: could not save ticket_id (${updateError.message}).`);
        continue;
      }

      const firstName =
        row.firstName.trim() || (reg.first_name as string | null)?.trim() || "Guest";

      try {
        const result = await sendRegistrationConfirmation({
          firstName,
          email: reg.email,
          registrationId: String(reg.id),
          ticketId: row.ticketId.trim(),
          idempotencyKey: `confirmations-import/${reg.id}/${Date.now()}`,
        });

        if (!result.ok) {
          failed += 1;
          errors.push(`${reg.email}: ${result.error}`);
          continue;
        }

        const { error: flagError } = await supabase
          .from("registrations")
          .update({ confirmation_email_sent: true })
          .eq("id", reg.id);

        if (flagError) {
          errors.push(
            `${reg.email}: email sent but failed to set confirmation_email_sent (${flagError.message}).`,
          );
        }

        sent += 1;
      } catch (err) {
        failed += 1;
        const message = err instanceof Error ? err.message : "Send failed.";
        errors.push(`${reg.email}: ${message}`);
      }
    }

    return NextResponse.json({
      message: "Import and send completed.",
      totalRows: rows.length,
      processed,
      sent,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Confirmations import-send error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
