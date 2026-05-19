import { NextResponse } from "next/server";

import { confirmationSendTemplateBuffer } from "@/lib/admin-excel";

export async function GET() {
  try {
    const file = confirmationSendTemplateBuffer();
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="confirmation-send-with-ticket-template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Confirmations template error:", error);
    return NextResponse.json({ error: "Could not build template." }, { status: 500 });
  }
}
