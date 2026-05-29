import { NextResponse } from "next/server";

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
    const reviewedAt = new Date().toISOString();
    const updatePayload =
      action === "reject"
        ? {
            approval_status: newStatus,
            rejection_email_sent: false,
            created_at: reviewedAt,
          }
        : { approval_status: newStatus, created_at: reviewedAt };
    const { error: updateError } = await supabase
      .from("registrations")
      .update(updatePayload)
      .in("id", pendingIds);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message:
        action === "approve"
          ? "Selected registrations approved."
          : "Selected registrations rejected. No rejection emails were sent.",
      action,
      processed: pendingRows.length,
    });
  } catch (error) {
    console.error("Admin registrations review error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
