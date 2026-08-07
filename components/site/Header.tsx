"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NAV, CONTACTS } from "@/lib/site";
import Socials from "@/components/site/Socials";
import CabinetLink from "@/components/site/CabinetLink";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // На главной оставляем якорь «#services» — браузер плавно прокручивает сам
  // (scroll-behavior: smooth + scroll-margin-top в globals.css).
  // На подстраницах такого блока нет, поэтому ссылка должна вести на главную: «/#services».
  const isHome = pathname === "/";
  const navHref = (href: string) => (isHome ? href : `/${href}`);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-paper/95">
      {/* flex-wrap — страховка, а не рабочий режим: содержимое рассчитано так, чтобы
          помещаться в 1112px (контейнер 1152 минус отступы) на любой ширине экрана.
          Если в чужом браузере шрифт окажется шире и запас в ~20px кончится, правый
          блок перенесётся на вторую строку внутри контейнера, а не уедет за край. */}
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-2.5">
        <a href={isHome ? "#top" : "/"} className="flex shrink-0 items-center" aria-label="KOVI Finance — на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
        </a>

        {/* Полное меню только с lg. На 768–1024 логотип + 7 пунктов + телефон + кнопка
            требуют ~1040px при доступных 984 — и всё это переносилось на вторую строку.
            Шаг между пунктами всегда 16px: контейнер шире 1152px не становится, поэтому
            запаса на широкий шаг (было xl:gap-7, +72px) в бюджете шапки просто нет. */}
        <nav className="hidden items-center gap-4 lg:flex">
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
            <CabinetLink variant="menu" onClick={() => setOpen(false)} />
            <Socials className="mt-3" />
          </nav>
        </div>
      )}
    </header>
  );
}
