"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("kovi-cookie-ok")) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try {
      localStorage.setItem("kovi-cookie-ok", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-20 z-50 mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white p-4 shadow-[var(--shadow-lift)] md:bottom-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted">
          Мы используем файлы cookie для работы сайта и аналитики. Продолжая пользоваться сайтом,
          вы соглашаетесь с{" "}
          <Link href="/confidentiality" className="text-brand underline underline-offset-2">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink-2"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
