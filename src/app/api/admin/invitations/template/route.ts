import { NextResponse } from "next/server";

import { invitationTemplateBuffer } from "@/lib/admin-excel";

export async function GET() {
  const file = invitationTemplateBuffer();

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="invitation-import-template.xlsx"',
    },
  });
}
