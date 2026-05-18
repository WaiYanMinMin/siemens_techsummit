import { NextResponse } from "next/server";

import { sendInvitationEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type InvitationType = "csuites" | "associates";
const FIXED_CTA_URL = "https://www.siemenstechsummitsg2026.com/#register";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("invitation_recipients")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invitations: data ?? [] });
  } catch (error) {
    console.error("Admin invitations GET error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      firstName?: string;
      email?: string;
      associationName?: string;
      invitationType?: InvitationType;
    };

    const firstName = payload.firstName?.trim() ?? "";
    const email = payload.email?.trim().toLowerCase() ?? "";
    const associationName = payload.associationName?.trim() ?? "";
    const invitationType = payload.invitationType ?? "associates";

    if (!firstName || !email || !associationName) {
      return NextResponse.json(
        { error: "firstName, email and associationName are required." },
        { status: 400 },
      );
    }

    if (invitationType !== "csuites" && invitationType !== "associates") {
      return NextResponse.json(
        { error: "invitationType must be csuites or associates." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: invitationRecord, error: insertError } = await supabase
      .from("invitation_recipients")
      .insert({
        first_name: firstName,
        email,
        association_name: associationName,
        invitation_type: invitationType,
        last_error: null,
      })
      .select("id")
      .single();

    let invitationId = invitationRecord?.id;
    if (insertError?.code === "23505") {
      const { data: existingRecord, error: existingRecordError } = await supabase
        .from("invitation_recipients")
        .select("id")
        .eq("email", email)
        .limit(1)
        .maybeSingle();

      if (existingRecordError || !existingRecord?.id) {
        return NextResponse.json(
          {
            error:
              existingRecordError?.message ??
              "Could not resolve existing invitation recipient.",
          },
          { status: 500 },
        );
      }

      invitationId = existingRecord.id;
    } else if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (!invitationId) {
      return NextResponse.json(
        { error: "Could not determine invitation id." },
        { status: 500 },
      );
    }

    const sendResult = await sendInvitationEmail({
      firstName,
      email,
      associationName,
      invitationType,
      ctaUrl: FIXED_CTA_URL,
      invitationId: String(invitationId),
    });

    if (!sendResult.ok) {
      await supabase
        .from("invitation_recipients")
        .update({ last_error: sendResult.error, sent_at: null })
        .eq("id", invitationId);

      return NextResponse.json(
        { error: `Invitation email failed (${sendResult.error})` },
        { status: 500 },
      );
    }

    await supabase
      .from("invitation_recipients")
      .update({ sent_at: new Date().toISOString(), last_error: null })
      .eq("id", invitationId);

    return NextResponse.json({
      message: "Invitation email sent.",
      invitationId,
    });
  } catch (error) {
    console.error("Admin invitations POST error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
