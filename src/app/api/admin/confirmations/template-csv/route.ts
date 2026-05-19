import { NextResponse } from "next/server";

import { confirmationSendTemplateCsvBuffer } from "@/lib/admin-excel";

export async function GET() {
  try {
    const file = confirmationSendTemplateCsvBuffer();
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="confirmation-send-with-ticket-template.csv"',
      },
    });
  } catch (error) {
    console.error("Confirmations CSV template error:", error);
    return NextResponse.json({ error: "Could not build template." }, { status: 500 });
  }
}
