import { NextResponse } from "next/server";

import { INVITATION_SEND_BATCH_SIZE } from "@/lib/invitation-send";
import {
  type InvitationType,
  processInvitationBatch,
} from "@/lib/invitation-send";

export const maxDuration = 300;

const validTypes = new Set<InvitationType>(["default", "csuites", "associates"]);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      invitationType?: InvitationType;
      rows?: Array<{
        firstName?: string;
        email?: string;
        associationName?: string;
      }>;
    };

    const invitationType = payload.invitationType ?? "default";
    if (!validTypes.has(invitationType)) {
      return NextResponse.json(
        { error: "invitationType must be default, csuites or associates." },
        { status: 400 },
      );
    }

    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    if (rows.length === 0) {
      return NextResponse.json({ error: "rows must not be empty." }, { status: 400 });
    }

    if (rows.length > INVITATION_SEND_BATCH_SIZE) {
      return NextResponse.json(
        {
          error: `Each batch may contain at most ${INVITATION_SEND_BATCH_SIZE} rows.`,
        },
        { status: 400 },
      );
    }

    const normalized = rows.map((row, index) => {
      const firstName = row.firstName?.trim() ?? "";
      const email = row.email?.trim().toLowerCase() ?? "";
      const associationName = row.associationName?.trim() ?? "";
      if (!firstName || !email) {
        throw new Error(`Row ${index + 1}: firstName and email are required.`);
      }
      return { firstName, email, associationName };
    });

    const result = await processInvitationBatch(normalized, invitationType);

    return NextResponse.json({
      message: "Batch send completed.",
      ...result,
    });
  } catch (error) {
    console.error("Admin invitation send-batch error:", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
