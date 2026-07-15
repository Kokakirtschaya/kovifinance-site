"use client";

import { useState } from "react";
import { NAV, CONTACTS } from "@/lib/site";
import Socials from "@/components/site/Socials";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 py-2.5">
        <a href="#top" className="flex items-center" aria-label="KOVI Finance — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden flex-col items-end gap-2 md:flex">
          <div className="flex items-center gap-4">
            <a href={CONTACTS.phoneHref} className="text-sm font-medium text-ink">
              {CONTACTS.phone}
            </a>
            <a
              href="#lead"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Оставить заявку
            </a>
          </div>
          <Socials />
        </div>

        <button
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-black/10 md:hidden"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-paper px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-1 text-sm text-ink"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#lead"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white"
            >
              Оставить заявку
            </a>
            <Socials className="mt-3" />
          </nav>
        </div>
      )}
    </header>
  );
}
