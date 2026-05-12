import { Resend } from "resend";

type ConfirmationEmailInput = {
  firstName: string;
  email: string;
  registrationId: string;
};

type InvitationEmailInput = {
  firstName: string;
  email: string;
  invitationId: string;
  ctaUrl: string;
};

type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

let resendClient: Resend | null = null;

function getResendClient() {
  if (resendClient) {
    return resendClient;
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is missing.");
  }

  resendClient = new Resend(resendApiKey);
  return resendClient;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildBaseLayout(content: string) {
  const heroImageUrl = process.env.EMAIL_HERO_IMAGE_URL?.trim();
  const safeHeroImageUrl = heroImageUrl ? escapeHtml(heroImageUrl) : "";
  const headerBackgroundStyle = safeHeroImageUrl
    ? `background:#000029 url('${safeHeroImageUrl}') no-repeat right center;background-size:46% auto;`
    : "background:#000029;";
  const headerTextCellStyle = safeHeroImageUrl
    ? "max-width:58%;padding-right:130px;"
    : "";

  return `
    <div style="background:#000029;margin:0;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#000029;border-radius:14px;overflow:hidden;border:1px solid #24407a;">
        <tr>
          <td style="${headerBackgroundStyle}padding:28px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle" style="${headerTextCellStyle}">
                  <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;line-height:1.2;">Siemens Tech Summit 2026</p>
                  <p style="margin:8px 0 0;color:#7de6d5;font-size:14px;font-weight:700;">Experience the Future through Sustainable Digitalization</p>
                  <p style="margin:10px 0 0;color:#ffffffcc;font-size:12px;">Singapore, 1 July 2026 · Raffles City Convention Centre</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;background:#02023e;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="padding:18px 24px;background:#000029;border-top:1px solid #24407a;">
            <p style="margin:0;color:#cbd5e1;font-size:12px;">Siemens Tech Summit 2026. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

export function buildConfirmationEmailHtml(firstName: string) {
  const safeName = escapeHtml(firstName || "Guest");

  return buildBaseLayout(`
    <p style="margin:0 0 14px;font-size:14px;color:#ffffff;">Dear ${safeName},</p>
    <h2 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#00d7c7;">Your Registration Is Confirmed</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#e2e8f0;">
      Thank you for registering for Siemens Tech Summit Singapore 2026.
      Your registration has been successfully received.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 16px;background:#d8fbf5;border-radius:12px;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#0f172a;line-height:1.65;">
          <strong style="display:block;margin-bottom:4px;">What happens next?</strong>
          Closer to the event date, we will send your QR code access details and additional event updates.
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#ffffff;">Best regards,<br />Siemens Singapore Team</p>
  `);
}

export function buildInvitationEmailHtml(firstName: string, ctaUrl: string) {
  const safeName = escapeHtml(firstName || "Guest");
  const safeCtaUrl = escapeHtml(ctaUrl);

  return buildBaseLayout(`
    <p style="margin:0 0 12px;font-size:14px;color:#ffffff;">Dear ${safeName},</p>
    <h2 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#00d7c7;">You Are Invited</h2>
    <p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#e2e8f0;">
      Join us for Siemens Tech Summit 2026 and discover how sustainable digitalization
      is transforming industries through intelligent automation, data-driven insights, and connected systems.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 16px;background:#d8fbf5;border-radius:12px;">
      <tr>
        <td style="padding:14px 16px;font-size:13px;color:#0f172a;">
          <strong>Date:</strong> Wednesday, 1 July 2026<br />
          <strong>Time:</strong> 9.00am to 6.00pm<br />
          <strong>Venue:</strong> Raffles City Convention Centre
        </td>
      </tr>
    </table>
    <p style="margin:0 0 18px;font-size:14px;color:#e2e8f0;">Reserve your place today:</p>
    <a href="${safeCtaUrl}" style="display:inline-block;background:#7de6d5;color:#00153b;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;font-size:13px;">
      REGISTER NOW
    </a>
  `);
}

export async function sendRegistrationConfirmation({
  firstName,
  email,
  registrationId,
}: ConfirmationEmailInput) {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("FROM_EMAIL is missing.");
  }

  const resend = getResendClient();

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject: "Registration Confirmation: Siemens Tech Summit Singapore 2026",
      html: buildConfirmationEmailHtml(firstName),
    },
    {
      idempotencyKey: `registration-confirmation/${registrationId}`,
    },
  );

  if (error) {
    return { ok: false, error: error.message } satisfies EmailResult;
  }

  if (!data?.id) {
    return { ok: false, error: "Email API did not return a message id." } satisfies EmailResult;
  }

  return { ok: true, id: data.id } satisfies EmailResult;
}

export async function sendInvitationEmail({
  firstName,
  email,
  invitationId,
  ctaUrl,
}: InvitationEmailInput) {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("FROM_EMAIL is missing.");
  }

  const resend = getResendClient();
  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject: "Invitation: Siemens Tech Summit Singapore 2026",
      html: buildInvitationEmailHtml(firstName, ctaUrl),
    },
    {
      idempotencyKey: `invitation-email/${invitationId}`,
    },
  );

  if (error) {
    return { ok: false, error: error.message } satisfies EmailResult;
  }

  if (!data?.id) {
    return { ok: false, error: "Email API did not return a message id." } satisfies EmailResult;
  }

  return { ok: true, id: data.id } satisfies EmailResult;
}
