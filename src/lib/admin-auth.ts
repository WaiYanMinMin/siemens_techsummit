export const ADMIN_COOKIE_NAME = "siemens_admin_session";

const DEFAULT_ADMIN_PASSWORD = "SiemensSummit@2026";

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
