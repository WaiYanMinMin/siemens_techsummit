import { NextResponse } from "next/server";

import { toRegistrationInsertPayload } from "@/lib/admin-registration";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      mobileNumber?: string;
      jobTitle?: string;
      company?: string;
      industry?: string;
      breakoutTrack?: string;
      challenges?: string[];
      needTimeline?: "6_months" | "12_months" | "exploring" | "no_requirement";
      consent?: boolean;
    };

    const firstName = payload.firstName?.trim() ?? "";
    const lastName = payload.lastName?.trim() ?? "";
    const email = payload.email?.trim() ?? "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "firstName, lastName and email are required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("registrations")
      .update(toRegistrationInsertPayload({ ...payload, firstName, lastName, email }))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registration: data });
  } catch (error) {
    console.error("Admin registrations PUT error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("registrations").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin registrations DELETE error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
