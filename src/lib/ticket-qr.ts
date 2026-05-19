import QRCode from "qrcode";

/**
 * String encoded into the QR. Optional env prefix (e.g. check-in URL base).
 * Example: TICKET_QR_PAYLOAD_PREFIX=https://example.com/checkin?t=
 */
export function ticketQrPayload(ticketId: string): string {
  const prefix = process.env.TICKET_QR_PAYLOAD_PREFIX?.trim() ?? "";
  return `${prefix}${ticketId.trim()}`;
}

export async function ticketIdToQrPngBase64(ticketId: string): Promise<string> {
  const png = await QRCode.toBuffer(ticketQrPayload(ticketId), {
    type: "png",
    width: 480,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
  return png.toString("base64");
}
