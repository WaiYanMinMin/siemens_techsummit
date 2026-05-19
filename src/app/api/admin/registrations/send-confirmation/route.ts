import { NextResponse } from "next/server";

import { sendRegistrationConfirmation } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type Body = {
  ids?: Array<string | number>;
  /** Optional per-id ticket override (otherwise uses row.ticket_id from DB) */
  ticketIds?: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Body;
    const ids = Array.isArray(payload.ids)
      ? payload.ids.map((id) => String(id)).filter(Boolean)
      : [];
    const ticketIds = payload.ticketIds ?? {};

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one registration." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("id, first_name, email, approval_status, ticket_id")
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = registrations ?? [];
    if (rows.length === 0) {
      return NextResponse.json(
        { error: "No matching registrations found for selected IDs." },
        { status: 400 },
      );
    }

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const idStr = String(row.id);
      if (row.approval_status !== "approved") {
        failed += 1;
        errors.push(
          `${row.email}: not approved (status: ${row.approval_status ?? "unknown"}).`,
        );
        continue;
      }

      const ticketId =
        ticketIds[idStr]?.trim() || (row.ticket_id as string | null)?.trim() || "";
      if (!ticketId) {
        failed += 1;
        errors.push(
          `${row.email}: missing ticket id — set ticket_id on the registration or pass ticketIds in the request body.`,
        );
        continue;
      }

      try {
        const result = await sendRegistrationConfirmation({
          firstName: row.first_name ?? "Guest",
          email: row.email,
          registrationId: idStr,
          ticketId,
          idempotencyKey: `admin-confirmation/${idStr}/${Date.now()}`,
        });

        if (!result.ok) {
          failed += 1;
          errors.push(`${row.email}: ${result.error}`);
          continue;
        }

        const { error: updateError } = await supabase
          .from("registrations")
          .update({ confirmation_email_sent: true })
          .eq("id", row.id);

        if (updateError) {
          errors.push(
            `${row.email}: email sent but failed to set confirmation_email_sent (${updateError.message}).`,
          );
        }

        sent += 1;
      } catch (err) {
        failed += 1;
        const message = err instanceof Error ? err.message : "Unexpected send error.";
        errors.push(`${row.email}: ${message}`);
      }
    }

    return NextResponse.json({
      message: "Confirmation send finished.",
      selected: ids.length,
      processed: rows.length,
      sent,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Admin send confirmation error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
