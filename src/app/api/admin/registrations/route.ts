import { NextResponse } from "next/server";

import { toRegistrationInsertPayload } from "@/lib/admin-registration";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

const PAGE_SIZE = 1000;

async function fetchAllRegistrations() {
  const supabase = getSupabaseAdminClient();
  const registrations = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) {
      throw error;
    }

    if (!data?.length) {
      break;
    }

    registrations.push(...data);

    if (data.length < PAGE_SIZE) {
      break;
    }

    from += PAGE_SIZE;
  }

  return registrations;
}

export async function GET() {
  try {
    const registrations = await fetchAllRegistrations();

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Admin registrations GET error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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
      .insert(toRegistrationInsertPayload({ ...payload, firstName, lastName, email }))
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ registration: data });
  } catch (error) {
    console.error("Admin registrations POST error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
