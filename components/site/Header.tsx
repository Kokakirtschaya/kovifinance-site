"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import { useActiveSection } from "@/lib/use-active-section";
import Socials from "@/components/site/Socials";
import CabinetLink from "@/components/site/CabinetLink";
import SiteIcon from "@/components/site/SiteIcon";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const active = useActiveSection();
  const isHome = pathname === "/";
  const navHref = (href: string) => isHome ? href : `/${href}`;

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-paper">
      <div className={`${SHELL} flex min-h-16 items-center justify-between gap-4 py-2.5`}>
        <a href={isHome ? "#top" : "/"} className="shrink-0" aria-label="KOVI Finance, на главную">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-7 w-auto sm:h-8" />
        </a>
        <nav aria-label="Основная навигация" className="hidden items-center gap-1 xl:flex 2xl:gap-3">
          {NAV.map(n => (
            <a key={n.href} href={navHref(n.href)} aria-current={isHome && active === n.href ? "location" : undefined}
              className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-2.5 text-sm transition-colors ${isHome && active === n.href ? "bg-brand-soft font-medium text-brand-dark" : "text-muted hover:bg-black/[0.03] hover:text-ink"}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <a href={CONTACTS.phoneHref} className="hidden whitespace-nowrap text-sm font-medium xl:block">{CONTACTS.phone}</a>
          <div className="hidden xl:block"><CabinetLink variant="icon" /></div>
          <a href={navHref("#lead")} className="button-primary hidden min-h-11 whitespace-nowrap px-4 py-2.5 sm:inline-flex">Обсудить задачу</a>
          <button ref={menuButton} type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="mobile-navigation"
            onClick={() => setOpen(v => !v)} className="grid size-11 place-items-center rounded-lg border border-black/10 xl:hidden">
            <SiteIcon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-navigation" className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-black/10 bg-paper px-5 py-4 xl:hidden">
          <nav aria-label="Мобильная навигация" className="flex flex-col">
            {NAV.map(n => <a key={n.href} href={navHref(n.href)} onClick={() => setOpen(false)} className="py-3 text-base">{n.label}</a>)}
            <div className="my-3 border-t border-black/10" />
            <Link href="/agents" onClick={() => setOpen(false)} className="py-3 text-sm text-muted">Агентам и партнёрам</Link>
            <Link href="/crm" onClick={() => setOpen(false)} className="py-3 text-sm text-muted">KOVI CRM</Link>
            <CabinetLink variant="menu" onClick={() => setOpen(false)} />
            <a href={CONTACTS.phoneHref} className="mt-3 py-3 text-base font-medium">{CONTACTS.phone}</a>
            <a href={navHref("#lead")} onClick={() => setOpen(false)} className="button-primary mt-3">Обсудить задачу</a>
            <Socials className="mt-5" />
          </nav>
        </div>
      )}
    </header>
  );
}
