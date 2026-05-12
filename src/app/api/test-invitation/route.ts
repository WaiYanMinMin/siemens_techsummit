import { NextResponse } from "next/server";

import { sendInvitationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      email?: string;
      firstName?: string;
      ctaUrl?: string;
    };

    const email = payload.email?.trim();
    const firstName = payload.firstName?.trim() || "Guest";
    const ctaUrl =
      payload.ctaUrl?.trim() || "https://siemenstechsummit.vercel.app/#register";

    if (!email) {
      return NextResponse.json(
        { error: "email is required in request body." },
        { status: 400 },
      );
    }

    const invitationResult = await sendInvitationEmail({
      firstName,
      email,
      invitationId: `manual-test-${Date.now()}`,
      ctaUrl,
    });

    if (!invitationResult.ok) {
      return NextResponse.json(
        { error: `Invitation email failed: ${invitationResult.error}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Invitation email sent successfully.",
      emailId: invitationResult.id,
    });
  } catch (error) {
    console.error("Test invitation API error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while sending invitation email." },
      { status: 500 },
    );
  }
}
