import { NextResponse } from "next/server";

import { sendRegistrationRejection } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type ReviewAction = "approve" | "reject";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      ids?: Array<string | number>;
      action?: ReviewAction;
    };

    const ids = Array.isArray(payload.ids)
      ? payload.ids.map((id) => String(id)).filter(Boolean)
      : [];
    const action = payload.action;

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one registration." },
        { status: 400 },
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "action must be approve or reject." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const newStatus = action === "approve" ? "approved" : "rejected";

    const rejectionDelayHoursRaw = process.env.REJECTION_EMAIL_DELAY_HOURS?.trim();
    const rejectionDelayHours = Math.max(
      0,
      Math.min(
        24 * 30,
        Number.parseInt(rejectionDelayHoursRaw ?? "0", 10) || 0,
      ),
    );
    const rejectionScheduledAt =
      action === "reject" && rejectionDelayHours > 0
        ? new Date(
            Date.now() + rejectionDelayHours * 60 * 60 * 1000,
          ).toISOString()
        : undefined;

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
        { error: "No matching registrations found for selected IDs." },
        { status: 400 },
      );
    }

    const pendingRows = rows.filter((row) => row.approval_status === "pending");
    if (pendingRows.length === 0) {
      return NextResponse.json(
        {
          error:
            "Selected registrations are not in the registrants queue (already approved or rejected).",
        },
        { status: 400 },
      );
    }

    const pendingIds = pendingRows.map((row) => row.id);
    const { error: updateError } = await supabase
      .from("registrations")
      .update({ approval_status: newStatus })
      .in("id", pendingIds);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    let emailsSent = 0;
    let emailsFailed = 0;
    const errors: string[] = [];

    if (action === "reject") {
      for (const row of pendingRows) {
        const result = await sendRegistrationRejection({
          firstName: row.first_name ?? "Guest",
          email: row.email,
          registrationId: String(row.id),
          ...(rejectionScheduledAt
            ? { scheduledAt: rejectionScheduledAt }
            : {}),
          idempotencyKey: `admin-reject/${row.id}/${rejectionScheduledAt ?? "immediate"}`,
        });

        if (result.ok) {
          emailsSent += 1;
        } else {
          emailsFailed += 1;
          errors.push(`${row.email}: ${result.error}`);
        }
      }
    }

    return NextResponse.json({
      message:
        action === "approve"
          ? "Selected registrations approved."
          : rejectionScheduledAt
            ? `Selected registrations rejected. Rejection emails scheduled via Resend (first send at ${rejectionScheduledAt}).`
            : "Selected registrations rejected.",
      action,
      processed: pendingRows.length,
      emailsSent,
      emailsFailed,
      rejectionEmailDelayHours: action === "reject" ? rejectionDelayHours : undefined,
      rejectionScheduledAt: action === "reject" ? rejectionScheduledAt ?? null : undefined,
      errors,
    });
  } catch (error) {
    console.error("Admin registrations review error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
