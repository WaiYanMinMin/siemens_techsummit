export const ADMIN_COOKIE_NAME = "siemens_admin_session";

const DEFAULT_ADMIN_PASSWORD = "SiemensSummit@2026";

/** Separate area: confirmation emails + QR attachment import (env override recommended). */
export const CONFIRMATIONS_ADMIN_COOKIE_NAME = "siemens_confirmations_admin_session";

const DEFAULT_CONFIRMATIONS_ADMIN_PASSWORD = "SiemensAdmin@2026";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;
}

export function getAdminSessionToken() {
  return `admin:${getAdminPassword()}`;
}

export function isValidAdminPassword(password: string) {
  return password.trim() === getAdminPassword();
}

export function isAdminAuthenticatedCookie(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  return cookieValue === getAdminSessionToken();
}

export function getConfirmationsAdminPassword() {
  return (
    process.env.CONFIRMATIONS_ADMIN_PASSWORD?.trim() ||
    DEFAULT_CONFIRMATIONS_ADMIN_PASSWORD
  );
}

export function getConfirmationsAdminSessionToken() {
  return `confirmations:${getConfirmationsAdminPassword()}`;
}

export function isValidConfirmationsAdminPassword(password: string) {
  return password.trim() === getConfirmationsAdminPassword();
}

export function isConfirmationsAuthenticatedCookie(cookieValue: string | undefined) {
  if (!cookieValue) {
    return false;
  }

  return cookieValue === getConfirmationsAdminSessionToken();
}
