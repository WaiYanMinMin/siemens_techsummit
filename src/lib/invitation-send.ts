import { sendInvitationEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export type InvitationType = "default" | "csuites" | "associates";

export type InvitationSendInputRow = {
  firstName: string;
  email: string;
  associationName: string;
};

export const INVITATION_SEND_BATCH_SIZE = 200;

export const FIXED_INVITATION_CTA_URL =
  "https://www.siemenstechsummitsg2026.com/#register";

export type InvitationBatchResult = {
  processed: number;
  imported: number;
  emailsSent: number;
  failed: number;
  errors: string[];
};

export async function processInvitationBatch(
  rows: InvitationSendInputRow[],
  invitationType: InvitationType,
): Promise<InvitationBatchResult> {
  const supabase = getSupabaseAdminClient();
  let imported = 0;
  let emailsSent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const { data: invitationRecord, error: insertError } = await supabase
      .from("invitation_recipients")
      .insert({
        first_name: row.firstName,
        email: row.email,
        association_name: row.associationName || null,
        invitation_type: invitationType,
        last_error: null,
      })
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
      ctaUrl: FIXED_INVITATION_CTA_URL,
      invitationId: String(invitationId),
    });

    if (!sendResult.ok) {
      failed += 1;
      errors.push(`${row.email}: invitation email failed (${sendResult.error})`);
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

  return {
    processed: rows.length,
    imported,
    emailsSent,
    failed,
    errors,
  };
}
