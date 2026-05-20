import { NextResponse } from "next/server";

import { parseInvitationRows, parseWorkbookRows } from "@/lib/admin-excel";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    const workbookRows = parseWorkbookRows(await file.arrayBuffer());
    const rows = parseInvitationRows(workbookRows);

    return NextResponse.json({
      total: rows.length,
      rows: rows.map((row) => ({
        firstName: row.firstName,
        email: row.email,
        associationName: row.associationName,
      })),
    });
  } catch (error) {
    console.error("Admin invitation parse error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
