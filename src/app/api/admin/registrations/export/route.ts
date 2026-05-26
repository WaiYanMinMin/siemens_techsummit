import { NextResponse } from "next/server";

import { registrationsExportBuffer } from "@/lib/admin-excel";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const exportableStatuses = new Set(["pending", "approved", "rejected"]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam =
      searchParams.get("approval_status")?.trim().toLowerCase() ?? "";
    const confirmationEmailParam =
      searchParams.get("confirmation_email_sent")?.trim().toLowerCase() ?? "";
    const filterByStatus = exportableStatuses.has(statusParam)
      ? (statusParam as "pending" | "approved" | "rejected")
      : null;

    const supabase = getSupabaseAdminClient();
    let query = supabase
      .from("registrations")
      .select(
        "id, first_name, last_name, email, mobile_number, job_title, company, industry, breakout_track, challenges, need_timeline, confirmation_email_sent, rejection_email_sent, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(10000);

    if (filterByStatus) {
      query = query.eq("approval_status", filterByStatus);
    }

    // Approved exports can target the selected confirmation email status tab.
    if (filterByStatus === "approved") {
      if (confirmationEmailParam === "sent") {
        query = query.eq("confirmation_email_sent", true);
      } else if (confirmationEmailParam !== "all") {
        query = query.or(
          "confirmation_email_sent.is.null,confirmation_email_sent.eq.false",
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const file = registrationsExportBuffer(data ?? []);
    const filename =
      filterByStatus === "approved"
        ? confirmationEmailParam === "sent"
          ? "registrations-approved-sent-export.xlsx"
          : confirmationEmailParam === "all"
            ? "registrations-approved-all-export.xlsx"
            : "registrations-approved-not-sent-export.xlsx"
        : filterByStatus === "rejected"
          ? "registrations-rejected-export.xlsx"
          : filterByStatus === "pending"
            ? "registrations-pending-export.xlsx"
            : "registrations-export.xlsx";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Admin registrations export error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 },
    );
  }
}
