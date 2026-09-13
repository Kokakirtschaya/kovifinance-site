"use client";

import { useSyncExternalStore } from "react";
import { COOKIE_CONSENT_CHANGE_EVENT, COOKIE_CONSENT_NAME, getCookie, parseConsent } from "@/lib/cookie-consent";

function subscribe(onChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
}
function noopSubscribe() { return () => {}; }

export function useCookieNoticeVisible() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribe, () => getCookie(COOKIE_CONSENT_NAME), () => null);
  return hydrated && parseConsent(raw) === null;
}
