import { NextResponse } from "next/server";

import { parseInvitationRows, parseWorkbookRows } from "@/lib/admin-excel";
import { sendInvitationEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type InvitationType = "csuites" | "associates";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const invitationType = (formData.get("invitationType") ?? "csuites")
      .toString()
      .toLowerCase() as InvitationType;
    const ctaUrl =
      formData.get("ctaUrl")?.toString().trim() ||
      "https://www.siemenstechsummitsg2026.com/#register";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (invitationType !== "csuites" && invitationType !== "associates") {
      return NextResponse.json(
        { error: "invitationType must be csuites or associates." },
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

      let invitationId = invitationRecord?.id;
      if (insertError?.code === "23505") {
        const { data: existingRecord, error: existingRecordError } = await supabase
          .from("invitation_recipients")
          .select("id")
          .eq("email", row.email)
          .limit(1)
          .maybeSingle();

        if (existingRecordError || !existingRecord?.id) {
          failed += 1;
          errors.push(
            `${row.email}: ${existingRecordError?.message ?? "Could not resolve existing invitation."}`,
          );
          continue;
        }

        invitationId = existingRecord.id;
      }

      if (insertError && insertError.code !== "23505") {
        failed += 1;
        errors.push(
          `${row.email}: ${insertError.message ?? "Could not insert invitation."}`,
        );
        continue;
      }

      if (!invitationId) {
        failed += 1;
        errors.push(`${row.email}: Could not determine invitation id.`);
        continue;
      }

      imported += 1;

      const sendResult = await sendInvitationEmail({
        firstName: row.firstName,
        email: row.email,
        associationName: row.associationName,
        invitationType,
        ctaUrl,
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
