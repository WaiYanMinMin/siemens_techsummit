import { Resend } from "resend";

type ConfirmationEmailInput = {
  firstName: string;
  email: string;
  registrationId: string;
  idempotencyKey?: string;
};

type RejectionEmailInput = {
  firstName: string;
  email: string;
  registrationId: string;
  idempotencyKey?: string;
};

type InvitationEmailInput = {
  firstName: string;
  email: string;
  invitationId: string;
  ctaUrl: string;
  invitationType?: "default" | "csuites" | "associates";
  associationName?: string;
  idempotencyKey?: string;
};

type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

let resendClient: Resend | null = null;

const DEFAULT_EMAIL_LOGO_URL =
  "https://siemenstechsummit.vercel.app/siemens-3-logo-png-transparent.png";

const DEFAULT_EMAIL_HERO_IMAGE_URL =
  "https://siemenstechsummit.vercel.app/key_visual_mobile.png";

function emailLogoUrl() {
  return process.env.EMAIL_LOGO_URL?.trim() || DEFAULT_EMAIL_LOGO_URL;
}

function emailHeroImageUrl() {
  return process.env.EMAIL_HERO_IMAGE_URL?.trim() || DEFAULT_EMAIL_HERO_IMAGE_URL;
}

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
  idempotencyKey,
}: ConfirmationEmailInput) {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("FROM_EMAIL is missing.");
  }

  const resend = getResendClient();
  const confirmationTemplateId = process.env.RESEND_TEMPLATE_CONFIRMATION_ID;
  const heroImageUrl = emailHeroImageUrl();
  const logoUrl = emailLogoUrl();

  if (!confirmationTemplateId) {
    throw new Error("RESEND_TEMPLATE_CONFIRMATION_ID is missing.");
  }

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject:
        "Registration Confirmation & Ticket: Siemens Tech Summit 2026",
      template: {
        id: confirmationTemplateId,
        variables: {
          first_name: firstName || "Guest",
          hero_image_url: heroImageUrl,
          logo_url: logoUrl,
        },
      },
    },
    {
      idempotencyKey: idempotencyKey ?? `registration-confirmation/${registrationId}`,
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

export async function sendRegistrationRejection({
  firstName,
  email,
  registrationId,
  idempotencyKey,
}: RejectionEmailInput) {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("FROM_EMAIL is missing.");
  }

  const resend = getResendClient();
  const rejectionTemplateId = process.env.RESEND_TEMPLATE_REJECTION_ID;
  const heroImageUrl = emailHeroImageUrl();
  const logoUrl = emailLogoUrl();

  if (!rejectionTemplateId) {
    throw new Error("RESEND_TEMPLATE_REJECTION_ID is missing.");
  }

  const { data, error } = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      subject: "Registration Update: Siemens Tech Summit 2026",
      template: {
        id: rejectionTemplateId,
        variables: {
          first_name: firstName || "Guest",
          hero_image_url: heroImageUrl,
          logo_url: logoUrl,
        },
      },
    },
    {
      idempotencyKey: idempotencyKey ?? `registration-rejection/${registrationId}`,
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
  invitationType = "default",
  associationName,
  idempotencyKey,
}: InvitationEmailInput) {
  const fromEmail = process.env.FROM_EMAIL;

  if (!fromEmail) {
    throw new Error("FROM_EMAIL is missing.");
  }

  const resend = getResendClient();
  const invitationTemplateIdByType = {
    default: process.env.RESEND_TEMPLATE_INVITATION_ID,
    csuites:
      process.env.RESEND_TEMPLATE_INVITATION_CSUITES_ID ??
      process.env.RESEND_TEMPLATE_INVITATION_ID,
    associates:
      process.env.RESEND_TEMPLATE_INVITATION_ASSOCIATES_ID ??
      process.env.RESEND_TEMPLATE_INVITATION_ID,
  } as const;
  const invitationTemplateId = invitationTemplateIdByType[invitationType];
  const heroImageUrl = emailHeroImageUrl();
  const logoUrl = emailLogoUrl();

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
          association_name: associationName || "",
          hero_image_url: heroImageUrl,
          logo_url: logoUrl,
        },
      },
    },
    {
      idempotencyKey:
        idempotencyKey ?? `invitation-email/${invitationId}/${invitationType}`,
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
