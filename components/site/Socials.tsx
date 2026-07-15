"use client";

import { CONTACTS } from "@/lib/site";

const ICONS: Record<string, React.ReactNode> = {
  youtube: (
    <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.8 12 3.8 12 3.8s-7.5 0-9.4.6A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.5v-7l6.2 3.5-6.2 3.5z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" />
    </>
  ),
  telegram: (
    <path d="M21.9 4.3 2.7 11.7c-1.1.4-1.1 1-.2 1.3l4.9 1.5 1.9 5.9c.2.6.4.8.9.8s.7-.2 1-.5l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.8-1.3-1.5z" />
  ),
  email: (
    <>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 6.5 12 12.5l8.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  phone: (
    <path d="M6.6 3.5c.4 0 .8.3 1 .7l1.2 2.9c.2.5.1 1-.3 1.4l-1.2 1c-.2.2-.3.4-.1.7a11 11 0 0 0 4.9 4.9c.3.2.5.1.7-.1l1-1.2c.4-.4.9-.5 1.4-.3l2.9 1.2c.4.2.7.6.7 1v3c0 .8-.6 1.5-1.4 1.4C9.3 21 3 14.7 3 6.9c0-.8.7-1.4 1.5-1.4z" />
  ),
};

const tgUsername = CONTACTS.telegram.split("/").filter(Boolean).pop() ?? "";

const LINKS = [
  { key: "youtube", href: CONTACTS.youtube, label: "YouTube", external: true },
  { key: "instagram", href: CONTACTS.instagram, label: "Instagram", external: true },
  { key: "telegram", href: CONTACTS.telegram, label: "Telegram", external: true, telegram: true },
  { key: "email", href: CONTACTS.emailHref, label: "Электронная почта", external: false },
  { key: "phone", href: CONTACTS.phoneHref, label: "Телефон", external: false },
];

// Сначала пытаемся открыть приложение (обходит блокировку домена t.me),
// если приложение не открылось за ~1.2 с — уводим на веб-версию t.me.
function openTelegram(e: React.MouseEvent) {
  if (!tgUsername) return;
  e.preventDefault();
  const web = CONTACTS.telegram;
  const deep = `tg://resolve?domain=${tgUsername}`;

  const timer = window.setTimeout(() => {
    window.location.href = web;
  }, 1200);

  const cancel = () => window.clearTimeout(timer);
  // если приложение открылось — вкладка уходит в фон, отменяем переход на t.me
  document.addEventListener("visibilitychange", () => document.hidden && cancel(), { once: true });
  window.addEventListener("pagehide", cancel, { once: true });
  window.addEventListener("blur", cancel, { once: true });

  window.location.href = deep;
}

export default function Socials({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const base =
    tone === "dark"
      ? "border-white/15 text-white/70"
      : "border-black/10 text-muted";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {LINKS.map((l) => (
        <a
          key={l.key}
          href={l.href}
          aria-label={l.label}
          onClick={l.telegram ? openTelegram : undefined}
          {...(l.external && !l.telegram ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`grid h-9 w-9 place-items-center rounded-full border ${base} transition-colors hover:border-brand hover:bg-brand hover:text-white`}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            {ICONS[l.key]}
          </svg>
        </a>
      ))}
    </div>
  );
}
