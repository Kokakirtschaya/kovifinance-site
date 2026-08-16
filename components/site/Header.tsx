"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import { useActiveSection } from "@/lib/use-active-section";
import Socials from "@/components/site/Socials";
import CabinetLink from "@/components/site/CabinetLink";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const active = useActiveSection();

  // На главной оставляем якорь «#services» — браузер плавно прокручивает сам
  // (scroll-behavior: smooth + scroll-margin-top в globals.css).
  // На подстраницах такого блока нет, поэтому ссылка должна вести на главную: «/#services».
  const isHome = pathname === "/";
  const navHref = (href: string) => (isHome ? href : `/${href}`);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/95">
      <div className={`${SHELL} flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5`}>
        <a href={isHome ? "#top" : "/"} className="flex shrink-0 items-center" aria-label="KOVI Finance — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
        </a>

        <nav className="hidden items-center gap-1 lg:flex xl:gap-2">
          {NAV.map((n) => {
            const isActive = isHome && active === n.href;
            return (
              <a
                key={n.href}
                href={navHref(n.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "font-medium text-brand-dark"
                    : "text-muted hover:bg-black/[0.03] hover:text-ink"
                }`}
              >
                {n.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-brand"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Одна строка на всех ширинах — шапка остаётся ровно 64px высотой, как и
            рассчитан отступ якорей (scroll-margin-top: 80px в globals.css).
            Соцсети из шапки убраны: 212px, а бюджет правого блока — 346px. Они никогда
            не помещались рядом с телефоном и кнопкой и вытесняли шапку за контейнер
            на 111px (проверено замерами на 1280–1920). Живут в футере и в моб. меню. */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Телефон — с 1200px: ниже его место занимает меню.
              Он остаётся в герое, футере и липкой кнопке снизу. */}
          <a
            href={CONTACTS.phoneHref}
            className="hidden whitespace-nowrap text-sm font-medium text-ink min-[1200px]:block"
          >
            {CONTACTS.phone}
          </a>
          {/* Кабинет — знаком: подпись «Личный кабинет» это 168px вместо 40px,
              с ней телефон и кнопка заявки в строку уже не входят. */}
          <CabinetLink variant="icon" />
          <a
            href={navHref("#lead")}
            className="whitespace-nowrap rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Оставить заявку
          </a>
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
                className={`py-1 text-sm ${
                  isHome && active === n.href ? "font-medium text-brand-dark" : "text-ink"
                }`}
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
            <CabinetLink variant="menu" onClick={() => setOpen(false)} />
            <Socials className="mt-3" />
          </nav>
        </div>
      )}
    </header>
  );
}
