import { NextResponse } from "next/server";

import { parseInvitationRows, parseWorkbookRows } from "@/lib/admin-excel";
import { sendInvitationEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type InvitationType = "default" | "csuites" | "associates";
const FIXED_CTA_URL = "https://www.siemenstechsummitsg2026.com/#register";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const invitationType = (formData.get("invitationType") ?? "default")
      .toString()
      .toLowerCase() as InvitationType;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (
      invitationType !== "default" &&
      invitationType !== "csuites" &&
      invitationType !== "associates"
    ) {
      return NextResponse.json(
        { error: "invitationType must be default, csuites or associates." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const workbookRows = parseWorkbookRows(await file.arrayBuffer());
    const rows = parseInvitationRows(workbookRows);

    let imported = 0;
    let emailsSent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const row of rows) {
      const { data: invitationRecord, error: insertError } = await supabase
        .from("invitation_recipients")
        .insert(
          {
            first_name: row.firstName,
            email: row.email,
            association_name: row.associationName || null,
            invitation_type: invitationType,
            last_error: null,
          },
        )
        .select("id")
        .single();

      if (insertError || !invitationRecord?.id) {
        failed += 1;
        errors.push(
          `${row.email}: ${insertError?.message ?? "Could not insert invitation."}`,
        );
        continue;
      }

      const invitationId = invitationRecord.id;

      imported += 1;

      const sendResult = await sendInvitationEmail({
        firstName: row.firstName,
        email: row.email,
        associationName: row.associationName,
        invitationType,
        ctaUrl: FIXED_CTA_URL,
        invitationId: String(invitationId),
      });

      if (!sendResult.ok) {
        failed += 1;
        errors.push(
          `${row.email}: invitation email failed (${sendResult.error})`,
        );
        await supabase
          .from("invitation_recipients")
          .update({ last_error: sendResult.error, sent_at: null })
          .eq("id", invitationId);
        continue;
      }

      emailsSent += 1;
      await supabase
        .from("invitation_recipients")
        .update({ sent_at: new Date().toISOString(), last_error: null })
        .eq("id", invitationId);
    }

    return NextResponse.json({
      message: "Invitation import completed.",
      totalRows: rows.length,
      imported,
      emailsSent,
      failed,
      errors,
    });
  } catch (error) {
    console.error("Admin invitation import error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
