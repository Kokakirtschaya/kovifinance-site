"use client";

import { useState } from "react";
import { SERVICES, CONTACTS } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

type Status = "idle" | "sending" | "ok" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="lead" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal>
      <div className="grid overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-[var(--shadow-lift)] lg:grid-cols-[1fr_1.1fr]">
        <div className="relative bg-ink p-8 text-paper md:p-12">
          <div className="grain pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              Оставьте заявку
            </h2>
            <p className="mt-4 text-white/70">
              Перезвоним в течение 15 минут в рабочее время, бесплатно разберём задачу и
              предложим реальные варианты финансирования.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80">
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Бесплатная консультация</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Без обязательств и предоплаты</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Конфиденциально</li>
            </ul>
            <div className="mt-10 space-y-1 text-sm">
              <a href={CONTACTS.phoneHref} className="block font-medium text-white">
                {CONTACTS.phone}
              </a>
              <a href={CONTACTS.emailHref} className="block text-white/70">
                {CONTACTS.email}
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {status === "ok" ? (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-3xl text-brand">
                ✓
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">Заявка отправлена</h3>
              <p className="mt-3 max-w-sm text-muted">
                Спасибо! Мы уже получили заявку и скоро свяжемся с вами.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Field name="name" label="Имя" placeholder="Как к вам обращаться" required />
              <Field
                name="phone"
                label="Телефон"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                required
              />
              <div>
                <Field name="email" label="E-mail" type="email" placeholder="you@company.ru" />
                <p className="mt-1.5 text-xs text-muted">
                  Оставьте, чтобы следить за заявкой в{" "}
                  <a href="/lk" className="text-brand underline underline-offset-2">
                    личном кабинете
                  </a>
                  .
                </p>
              </div>
              <Field name="inn" label="ИНН компании" placeholder="10 или 12 цифр" inputMode="numeric" />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Что интересует</label>
                <select
                  name="product"
                  defaultValue=""
                  className="w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
                >
                  <option value="" disabled>Выберите продукт</option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Другое">Другое / не знаю</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {status === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  Не удалось отправить. Позвоните нам:{" "}
                  <a href={CONTACTS.phoneHref} className="underline">{CONTACTS.phone}</a>
                </p>
              )}

              <p className="text-xs leading-relaxed text-muted">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и принимаете
                условия{" "}
                <a
                  href="/confidentiality"
                  target="_blank"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  Политики конфиденциальности
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
      </Reveal>
    </section>
  );
}

function Field({
  name,
  label,
  ...props
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-brand"
        {...props}
      />
    </div>
  );
}
