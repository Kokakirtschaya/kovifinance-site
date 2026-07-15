"use client";

import { useState } from "react";
import Link from "next/link";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const STEPS = ["Заявка принята", "Проверяем документы", "Подано в банк", "Решение банка"];

type App = {
  product: string;
  amount: number;
  company: string;
  step: number; // 1..4 — текущая стадия
  badge: { label: string; tone: "progress" | "approved" | "rejected" };
  updated: string;
  manager: string;
};

const DEMO_APPS: App[] = [
  {
    product: "Кредит для бизнеса",
    amount: 45_000_000,
    company: "ООО «Пример»",
    step: 3,
    badge: { label: "В работе", tone: "progress" },
    updated: "сегодня, 14:20",
    manager: "Анна — ваш менеджер",
  },
  {
    product: "Банковская гарантия",
    amount: 12_000_000,
    company: "ООО «Пример»",
    step: 2,
    badge: { label: "Проверка документов", tone: "progress" },
    updated: "вчера",
    manager: "Анна — ваш менеджер",
  },
];

type View = "login" | "sent" | "cabinet";

export default function CabinetDemo() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/5 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center" aria-label="KOVI Finance">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
              ДЕМО-макет
            </span>
            {view === "cabinet" ? (
              <button
                onClick={() => setView("login")}
                className="text-sm text-muted hover:text-ink"
              >
                Выйти
              </button>
            ) : (
              <Link href="/" className="text-sm text-muted hover:text-ink">
                ← На сайт
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-paper-2/40">
        {view !== "cabinet" ? (
          <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-20">
            <div className="rounded-3xl border border-black/[0.07] bg-white p-8 shadow-[var(--shadow-soft)]">
              {view === "login" ? (
                <>
                  <h1 className="text-2xl font-bold tracking-[-0.02em]">Личный кабинет</h1>
                  <p className="mt-2 text-sm text-muted">
                    Введите e-mail, с которого оставляли заявку. Пришлём ссылку для входа —
                    пароль не нужен.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setView("sent");
                    }}
                    className="mt-6 space-y-3"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.ru"
                      className="w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none focus:border-brand"
                    />
                    <button className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark">
                      Получить ссылку для входа
                    </button>
                  </form>
                  <p className="mt-4 text-xs text-muted">
                    Ещё не оставляли заявку?{" "}
                    <Link href="/#lead" className="text-brand underline underline-offset-2">
                      Оставить заявку
                    </Link>
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-2xl text-brand">
                    ✉
                  </div>
                  <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em]">Проверьте почту</h1>
                  <p className="mt-2 text-sm text-muted">
                    Отправили ссылку для входа на{" "}
                    <span className="font-medium text-ink">{email || "вашу почту"}</span>. Откройте
                    письмо и перейдите по ссылке.
                  </p>
                  <button
                    onClick={() => setView("cabinet")}
                    className="mt-6 w-full rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
                  >
                    Открыть демо-кабинет →
                  </button>
                  <p className="mt-3 text-xs text-muted">
                    (в демо — сразу, в реальности вход по ссылке из письма)
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl px-5 py-12">
            <h1 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">
              Здравствуйте! Ваши заявки
            </h1>
            <p className="mt-2 text-muted">Статусы обновляются по мере работы с банками.</p>

            <div className="mt-8 space-y-5">
              {DEMO_APPS.map((a, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold tracking-tight">{a.product}</h2>
                      <p className="mt-1 text-sm text-muted">
                        {fmt(a.amount)} ₽ · {a.company}
                      </p>
                    </div>
                    <Badge {...a.badge} />
                  </div>

                  <Tracker step={a.step} />

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-4 text-sm">
                    <span className="text-muted">Обновлено: {a.updated}</span>
                    <span className="font-medium text-brand-dark">{a.manager}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white/60 p-5 text-sm text-muted">
              Нужна ещё одна заявка?{" "}
              <Link href="/#lead" className="font-semibold text-brand underline underline-offset-2">
                Оформить новую
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Badge({ label, tone }: App["badge"]) {
  const styles = {
    progress: "bg-brand-soft text-brand-dark",
    approved: "bg-gold/15 text-gold",
    rejected: "bg-red-50 text-red-600",
  }[tone];
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>
  );
}

function Tracker({ step }: { step: number }) {
  return (
    <div className="mt-6 flex items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-brand text-white"
                    : current
                    ? "border-2 border-brand bg-white text-brand"
                    : "border border-black/15 bg-white text-muted"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`mt-2 w-24 text-center text-[11px] leading-tight ${
                  done || current ? "text-ink" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 ${n < step ? "bg-brand" : "bg-black/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
