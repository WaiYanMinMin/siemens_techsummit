import { NextResponse } from "next/server";

import { registrationTemplateBuffer } from "@/lib/admin-excel";

export async function GET() {
  const file = registrationTemplateBuffer();

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="registrations-import-template.xlsx"',
    },
  });
}
