/** Уведомление о необходимых cookie. Аналитики на сайте нет — выбора категорий нет. */

export const COOKIE_CONSENT_NAME = "kovi_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 месяцев
export const COOKIE_POLICY_VERSION = "2026-09-11n";
export const COOKIE_CONSENT_CHANGE_EVENT = "kovi:cookie-notice";
export const LEGACY_CONSENT_STORAGE_KEY = "kovi-cookie-ok";

export type CookieConsent = {
  v: string;
};

export function parseConsent(raw: string | null | undefined): CookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CookieConsent>;
    if (data.v !== COOKIE_POLICY_VERSION) return null;
    return { v: data.v };
  } catch {
    return null;
  }
}

export function serializeConsent(consent: CookieConsent): string {
  return JSON.stringify({ v: consent.v });
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq) !== name) continue;
    const value = part.slice(eq + 1);
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return null;
}

export function writeConsentCookie(consent: CookieConsent): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(serializeConsent(consent));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENT_NAME}=${value}; Path=/; Max-Age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
}

export function persistCookieNotice(): CookieConsent {
  const consent: CookieConsent = { v: COOKIE_POLICY_VERSION };
  writeConsentCookie(consent);
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGE_EVENT));
  try {
    localStorage.removeItem(LEGACY_CONSENT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return consent;
}
