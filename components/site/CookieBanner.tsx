"use client";

import Link from "next/link";
import { persistCookieNotice } from "@/lib/cookie-consent";
import { useCookieNoticeVisible } from "@/lib/use-cookie-notice";

export default function CookieBanner() {
  const show = useCookieNoticeVisible();
  if (!show) return null;
  return (
    <div role="dialog" aria-label="Уведомление о файлах cookie" aria-describedby="cookie-banner-text"
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[60] flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 shadow-[var(--shadow-lift)] sm:right-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:p-4">
      <p id="cookie-banner-text" className="text-xs leading-relaxed text-muted">
        Только необходимые cookie для работы сайта и входа. <Link href="/confidentiality#cookies" className="text-brand underline underline-offset-2">Подробнее</Link>
      </p>
      <button type="button" onClick={() => persistCookieNotice()} className="min-h-11 shrink-0 rounded-lg bg-ink px-4 text-sm font-medium text-white hover:bg-ink-2">Понятно</button>
    </div>
  );
}
