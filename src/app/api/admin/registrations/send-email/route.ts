import { NextResponse } from "next/server";

import { sendRegistrationRejection } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      ids?: Array<string | number>;
    };

    const ids = Array.isArray(payload.ids)
      ? payload.ids.map((id) => String(id)).filter(Boolean)
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one registration first." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("id, first_name, email, approval_status")
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = registrations ?? [];
    if (rows.length === 0) {
      return NextResponse.json(
        {
          error: "No matching registrations found for selected IDs.",
          selected: ids.length,
          processed: 0,
          sent: 0,
          failed: 0,
          errors: [],
        },
        { status: 400 },
      );
    }

    const rejectedRows = rows.filter((row) => row.approval_status === "rejected");
    if (rejectedRows.length === 0) {
      return NextResponse.json(
        {
          error: "Selected registrations are not rejected.",
          selected: ids.length,
          processed: rows.length,
          sent: 0,
          failed: 0,
          errors: [],
        },
        { status: 400 },
      );
    }

    let sent = 0;
    let failed = 0;
    const sentIds: Array<string | number> = [];
    const errors: string[] = [];

    for (const row of rejectedRows) {
      try {
        const perSendKey = `admin-bulk/rejection/${row.id}/${Date.now()}`;
        const result = await sendRegistrationRejection({
          firstName: row.first_name ?? "Guest",
          email: row.email,
          registrationId: String(row.id),
          idempotencyKey: perSendKey,
        });

        if (!result.ok) {
          failed += 1;
          errors.push(`${row.email}: ${result.error}`);
          console.error(
            `Rejection email resend failed for registration ${row.id} (${row.email}):`,
            result.error,
          );
        } else {
          sent += 1;
          sentIds.push(row.id);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected send error.";
        failed += 1;
        errors.push(`${row.email}: ${message}`);
        console.error(
          `Rejection email resend failed for registration ${row.id} (${row.email}):`,
          message,
        );
      }
    }

    if (sentIds.length > 0) {
      const { error: updateError } = await supabase
        .from("registrations")
        .update({ rejection_email_sent: true })
        .in("id", sentIds);

      if (updateError) {
        return NextResponse.json(
          {
            error: updateError.message,
            selected: ids.length,
            processed: rejectedRows.length,
            sent,
            failed,
            errors,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      message:
        failed > 0
          ? `Rejection email send completed with ${failed} failure(s).`
          : "Rejection email send completed. Status marked as sent.",
      selected: ids.length,
      processed: rejectedRows.length,
      sent,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Admin send registration email error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
