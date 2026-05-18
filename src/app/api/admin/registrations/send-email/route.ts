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
      .select("id, first_name, email")
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

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const perSendKey = `admin-bulk/rejection/${row.id}/${Date.now()}`;
        const result = await sendRegistrationRejection({
          firstName: row.first_name ?? "Guest",
          email: row.email,
          registrationId: String(row.id),
          idempotencyKey: perSendKey,
        });

        if (result.ok) {
          sent += 1;
        } else {
          failed += 1;
          errors.push(`${row.email}: ${result.error}`);
        }
      } catch (error) {
        failed += 1;
        const message =
          error instanceof Error ? error.message : "Unexpected send error.";
        errors.push(`${row.email}: ${message}`);
      }
    }

    return NextResponse.json({
      message: "Email send completed.",
      selected: ids.length,
      processed: rows.length,
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
