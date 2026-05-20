import { NextResponse } from "next/server";

import { parseInvitationRows, parseWorkbookRows } from "@/lib/admin-excel";
import {
  type InvitationType,
  INVITATION_SEND_BATCH_SIZE,
  processInvitationBatch,
} from "@/lib/invitation-send";

export const maxDuration = 300;

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

    const workbookRows = parseWorkbookRows(await file.arrayBuffer());
    const parsed = parseInvitationRows(workbookRows);

    if (parsed.length > INVITATION_SEND_BATCH_SIZE) {
      return NextResponse.json(
        {
          error: `This file has ${parsed.length} rows. Use files with at most ${INVITATION_SEND_BATCH_SIZE} rows, or use Import + send (with progress) which splits automatically.`,
        },
        { status: 400 },
      );
    }

    const rows = parsed.map((row) => ({
      firstName: row.firstName,
      email: row.email,
      associationName: row.associationName,
    }));

    const result = await processInvitationBatch(rows, invitationType);

    return NextResponse.json({
      message: "Invitation import completed.",
      totalRows: parsed.length,
      ...result,
    });
  } catch (error) {
    console.error("Admin invitation import error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
