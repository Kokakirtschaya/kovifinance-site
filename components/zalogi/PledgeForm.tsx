"use client";

import { useState } from "react";
import { CONTACTS } from "@/lib/site";
import { PROPERTY_GROUPS } from "@/lib/zalogi";
import Reveal from "@/components/site/Reveal";

type Status = "idle" | "sending" | "ok" | "error";

export default function PledgeForm() {
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
        // source: чтобы в заявке было видно, с какой страницы пришёл человек
        body: JSON.stringify({ ...data, source: "Кредит под залог недвижимости" }),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <section id="lead" className="mx-auto max-w-3xl px-5 py-20 md:py-28">
        <Reveal className="rounded-3xl border border-black/[0.07] bg-white p-10 text-center shadow-[var(--shadow-soft)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-3xl text-brand">
            ✓
          </div>
          <h2 className="mt-5 text-2xl font-bold tracking-tight">Спасибо!</h2>
          <p className="mt-2 text-muted">
            Заявка принята — свяжемся с вами и разберём объект.
          </p>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="lead" className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <Reveal className="text-center">
        <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Расскажите об <span className="text-brand">объекте</span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          Ответим, реально ли это, и назовём сумму — до всяких документов.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" label="Ваше имя" required />
            <Input name="phone" label="Телефон" type="tel" placeholder="+7 (___) ___-__-__" required />

            <label className="block">
              <span className="text-sm text-muted">Тип объекта</span>
              <select
                name="property"
                required
                defaultValue=""
                className="mt-1.5 w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
              >
                <option value="" disabled>
                  Выберите тип
                </option>
                {PROPERTY_GROUPS.flatMap((g) =>
                  g.items.map((item) => (
                    <option key={item} value={`${g.title}: ${item}`}>
                      {item}
                    </option>
                  )),
                )}
              </select>
            </label>

            <Input name="price" label="Примерная стоимость объекта, ₽" inputMode="numeric" />
            <Input
              name="email"
              label="E-mail"
              type="email"
              placeholder="you@company.ru"
              hint="для отслеживания в личном кабинете"
            />
          </div>

          <label className="mt-4 flex items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-brand)]"
            />
            <span>
              Согласен на обработку персональных данных и с{" "}
              <a href="/confidentiality" className="text-brand underline underline-offset-2">
                политикой конфиденциальности
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 w-full rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {status === "sending" ? "Отправляем…" : "Отправить заявку"}
          </button>

          {status === "error" && (
            <p className="mt-3 text-center text-sm text-red-600">
              Не отправилось. Попробуйте ещё раз или позвоните:{" "}
              <a href={CONTACTS.phoneHref} className="font-semibold text-brand">
                {CONTACTS.phone}
              </a>
            </p>
          )}
        </form>
      </Reveal>
    </section>
  );
}

function Input({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  inputMode,
  hint,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  inputMode?: "numeric" | "tel" | "text";
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        inputMode={inputMode}
        className="mt-1.5 w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-brand"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
