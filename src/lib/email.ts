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
  const confirmationTemplateId = process.env.RESEND_TEMPLATE_CONFIRMATION_ID;
  const heroImageUrl = process.env.EMAIL_HERO_IMAGE_URL?.trim() ?? "";

  if (!confirmationTemplateId) {
    throw new Error("RESEND_TEMPLATE_CONFIRMATION_ID is missing.");
  }

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject: "Registration Confirmation: Siemens Tech Summit Singapore 2026",
      template: {
        id: confirmationTemplateId,
        variables: {
          first_name: firstName || "Guest",
          hero_image_url: heroImageUrl,
        },
      },
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
  const invitationTemplateId = process.env.RESEND_TEMPLATE_INVITATION_ID;
  const heroImageUrl = process.env.EMAIL_HERO_IMAGE_URL?.trim() ?? "";

  if (!invitationTemplateId) {
    throw new Error("RESEND_TEMPLATE_INVITATION_ID is missing.");
  }

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject: "Invitation: Siemens Tech Summit Singapore 2026",
      template: {
        id: invitationTemplateId,
        variables: {
          first_name: firstName || "Guest",
          cta_url: ctaUrl,
          hero_image_url: heroImageUrl,
        },
      },
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
