import { NextResponse } from "next/server";

import { sendInvitationEmail, sendRegistrationConfirmation } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { registrationSchema } from "@/lib/validation";

const registrationSuccessMessage =
  "Thank you for your interest in Siemens Tech Summit 2026. We will be sending you an email with the event details shortly.";

export async function POST(request: Request) {
  try {
    const isDev = process.env.NODE_ENV !== "production";
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!serviceRole || serviceRole.includes("YOUR_SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server is missing SUPABASE_SERVICE_ROLE_KEY. Please update .env.local with your real key.",
        },
        { status: 500 },
      );
    }

    if (!resendKey || resendKey.includes("YOUR_RESEND_API_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server is missing RESEND_API_KEY. Please update .env.local with your real key.",
        },
        { status: 500 },
      );
    }

    const payload = await request.json();
    const parsed = registrationSchema.safeParse(payload);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "Invalid form data";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;
    const supabase = getSupabaseAdminClient();

    const { data: inserted, error } = await supabase
      .from("registrations")
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email.toLowerCase(),
        mobile_number: data.mobileNumber,
        job_title: data.jobTitle,
        company: data.company,
        industry: data.industry,
        breakout_track: data.breakoutTrack,
        challenges: data.challenges,
        need_timeline: data.needTimeline,
        consent: data.consent,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email or mobile number is already registered." },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          error: isDev
            ? `Could not save registration (${error.code ?? "unknown"}): ${error.message}`
            : "Could not save registration. Please try again.",
        },
        { status: 500 },
      );
    }

    if (!inserted?.id) {
      return NextResponse.json(
        { error: "Registration saved but could not determine record id." },
        { status: 500 },
      );
    }

    const confirmationResult = await sendRegistrationConfirmation({
      firstName: data.firstName,
      email: data.email,
      registrationId: String(inserted.id),
    });

    const invitationResult = await sendInvitationEmail({
      firstName: data.firstName,
      email: data.email,
      invitationId: String(inserted.id),
      ctaUrl: "https://www.siemenstechsummit2026.com/#register",
    });

    if (!confirmationResult.ok && !invitationResult.ok) {
      console.error("Confirmation email send failed:", confirmationResult.error);
      console.error("Invitation email send failed:", invitationResult.error);
      return NextResponse.json({ message: registrationSuccessMessage });
    }

    if (!confirmationResult.ok || !invitationResult.ok) {
      if (!confirmationResult.ok) {
        console.error("Confirmation email send failed:", confirmationResult.error);
      }
      if (!invitationResult.ok) {
        console.error("Invitation email send failed:", invitationResult.error);
      }
      return NextResponse.json({ message: registrationSuccessMessage });
    }

    return NextResponse.json({
      message: registrationSuccessMessage,
    });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 },
    );
  }
}
