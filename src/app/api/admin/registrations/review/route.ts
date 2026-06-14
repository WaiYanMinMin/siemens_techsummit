import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type ReviewAction = "approve" | "reject" | "pending";
type ApprovalStatus = "pending" | "approved" | "rejected";

const ACTION_TO_STATUS: Record<ReviewAction, ApprovalStatus> = {
  approve: "approved",
  reject: "rejected",
  pending: "pending",
};

const VALID_SOURCE_STATUSES: Record<ReviewAction, ApprovalStatus[]> = {
  approve: ["pending", "rejected"],
  reject: ["pending", "approved"],
  pending: ["approved", "rejected"],
};

function buildUpdatePayload(newStatus: ApprovalStatus, reviewedAt: string) {
  if (newStatus === "pending") {
    return {
      approval_status: newStatus,
      confirmation_email_sent: false,
      rejection_email_sent: false,
    };
  }

  if (newStatus === "approved") {
    return {
      approval_status: newStatus,
      rejection_email_sent: false,
      created_at: reviewedAt,
    };
  }

  return {
    approval_status: newStatus,
    confirmation_email_sent: false,
    rejection_email_sent: false,
    created_at: reviewedAt,
  };
}

function actionMessage(action: ReviewAction, processed: number): string {
  const countLabel = `${processed} registration${processed === 1 ? "" : "s"}`;

  switch (action) {
    case "approve":
      return `${countLabel} approved. No confirmation email was sent automatically.`;
    case "reject":
      return `${countLabel} rejected. No rejection email was sent automatically.`;
    case "pending":
      return `${countLabel} moved back to pending.`;
  }
}

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

    if (action !== "approve" && action !== "reject" && action !== "pending") {
      return NextResponse.json(
        { error: "action must be approve, reject, or pending." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const newStatus = ACTION_TO_STATUS[action];
    const allowedSources = VALID_SOURCE_STATUSES[action];

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

    const eligibleRows = rows.filter((row) =>
      allowedSources.includes(row.approval_status as ApprovalStatus),
    );

    if (eligibleRows.length === 0) {
      const sourceLabel =
        action === "approve"
          ? "pending or rejected"
          : action === "reject"
            ? "pending or approved"
            : "approved or rejected";
      return NextResponse.json(
        {
          error: `Selected registrations cannot be changed with this action. Only ${sourceLabel} registrations are eligible.`,
        },
        { status: 400 },
      );
    }

    const skippedCount = rows.length - eligibleRows.length;
    const eligibleIds = eligibleRows.map((row) => row.id);
    const reviewedAt = new Date().toISOString();
    const updatePayload = buildUpdatePayload(newStatus, reviewedAt);
    const { error: updateError } = await supabase
      .from("registrations")
      .update(updatePayload)
      .in("id", eligibleIds);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: actionMessage(action, eligibleRows.length),
      action,
      processed: eligibleRows.length,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Admin registrations review error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
