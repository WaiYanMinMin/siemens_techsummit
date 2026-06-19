import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { IS_REGISTRATION_OPEN } from "@/lib/site-config";
import { registrationSchema } from "@/lib/validation";

const registrationSuccessMessage =
  "Thank you for your interest in Siemens Tech Summit 2026. We have received your registration.";

export async function POST(request: Request) {
  try {
    if (!IS_REGISTRATION_OPEN) {
      return NextResponse.json(
        { error: "Registration for Siemens Tech Summit 2026 is now closed." },
        { status: 403 },
      );
    }

    const isDev = process.env.NODE_ENV !== "production";
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRole || serviceRole.includes("YOUR_SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        {
          error:
            "Server is missing SUPABASE_SERVICE_ROLE_KEY. Please update .env.local with your real key.",
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

    const { error } = await supabase.from("registrations").insert({
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
    });

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        // Temporarily allow duplicate submissions without exposing a conflict to the user.
        return NextResponse.json({ message: registrationSuccessMessage });
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

    return NextResponse.json({ message: registrationSuccessMessage });
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again." },
      { status: 500 },
    );
  }
}
