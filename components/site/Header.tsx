"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, CONTACTS } from "@/lib/site";
import Socials from "@/components/site/Socials";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // На главной оставляем якорь «#services» — его перехватывает Lenis и плавно прокручивает.
  // На подстраницах такого блока нет, поэтому ссылка должна вести на главную: «/#services».
  const isHome = pathname === "/";
  const navHref = (href: string) => (isHome ? href : `/${href}`);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-5 py-2.5">
        <a href={isHome ? "#top" : "/"} className="flex shrink-0 items-center" aria-label="KOVI Finance — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
        </a>

        {/* Полное меню только с lg. На 768–1024 логотип + 7 пунктов + телефон + кнопка
            требуют ~1040px при доступных 984 — и всё это переносилось на вторую строку. */}
        <nav className="hidden items-center gap-4 lg:flex xl:gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={navHref(n.href)}
              className="whitespace-nowrap text-sm text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden flex-col items-end gap-2 lg:flex">
          <div className="flex items-center gap-4">
            {/* Телефон и соцсети — с xl: на 1024–1280 они не помещаются рядом с меню.
                Телефон при этом остаётся в герое, футере и липкой кнопке снизу. */}
            <a
              href={CONTACTS.phoneHref}
              className="hidden whitespace-nowrap text-sm font-medium text-ink xl:block"
            >
              {CONTACTS.phone}
            </a>
            <a
              href={navHref("#lead")}
              className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
            >
              Оставить заявку
            </a>
          </div>
          <div className="hidden xl:block">
            <Socials />
          </div>
        </div>

        <button
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-black/10 lg:hidden"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-paper px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={navHref(n.href)}
                onClick={() => setOpen(false)}
                className="py-1 text-sm text-ink"
              >
                {n.label}
              </a>
            ))}
            <a
              href={CONTACTS.phoneHref}
              className="py-1 text-sm font-medium text-ink"
            >
              {CONTACTS.phone}
            </a>
            <a
              href={navHref("#lead")}
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
