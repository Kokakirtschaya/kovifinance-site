"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_NAME,
  getCookie,
  parseConsent,
  persistCookieNotice,
} from "@/lib/cookie-consent";

function subscribeNotice(onChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
}

function noopSubscribe() {
  return () => {};
}

export default function CookieBanner() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribeNotice, () => getCookie(COOKIE_CONSENT_NAME), () => null);
  const show = hydrated && parseConsent(raw) === null;

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Уведомление о файлах cookie"
      aria-describedby="cookie-banner-text"
      className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-3 shadow-[var(--shadow-lift)] md:bottom-4 md:p-4"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p id="cookie-banner-text" className="text-xs leading-relaxed text-muted md:text-sm">
          Сайт использует только необходимые cookie — для работы страниц и входа в кабинет.
          Аналитику и рекламу не ставим. Подробности в{" "}
          <Link href="/confidentiality#cookies" className="text-brand underline underline-offset-2">
            Политике обработки персональных данных
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => persistCookieNotice()}
          className="shrink-0 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
