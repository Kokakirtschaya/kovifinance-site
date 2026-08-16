"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import { isValidInn, normalizeInn } from "@/lib/inn";
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
    <section id="lead" className={`${SHELL} py-20 md:py-28`}>
      <Reveal>
      <div className="grid overflow-hidden rounded-3xl border border-black/[0.07] bg-white shadow-[var(--shadow-lift)] lg:grid-cols-[1fr_1.1fr]">
        <div className="relative bg-ink p-8 text-paper md:p-12">
          <div className="grain pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              Оставьте заявку
            </h2>
            <p className="mt-4 text-white/70">
              Перезвоним в течение дня, бесплатно разберём задачу и предложим реальные
              варианты финансирования, если они возможны.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80">
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Без обязательств и предоплаты</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Быстро</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Грамотно</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Конфиденциально</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Оплата за результат</li>
              <li className="flex gap-3"><span className="text-gold-bright">✓</span> Честно</li>
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
              <PhoneField />
              <div>
                <EmailField />
                <p className="mt-1.5 text-xs text-muted">
                  Оставьте, чтобы следить за заявкой в{" "}
                  <a href="/lk" className="text-brand underline underline-offset-2">
                    личном кабинете
                  </a>
                  . (необязательно)
                </p>
              </div>
              <InnField />
              <div>
                <label className="mb-1.5 block text-sm font-medium">Что интересует</label>
                <select
                  name="product"
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-black/10 bg-paper px-4 text-sm outline-none transition-colors focus:border-brand"
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
                className="press w-full rounded-full bg-brand px-6 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
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

// Телефон только РФ: +7 всегда зафиксирован, пользователь вводит 10 цифр
// (код 999 + номер 9999999). Маска расставляет скобки и дефисы на лету.
function formatPhone(digits: string) {
  if (digits.length === 0) return "";
  let out = "+7 (" + digits.slice(0, 3);
  // Разделители добавляем только когда после них есть цифры — иначе «хвост»
  // (закрывающая скобка / дефис) залипает при удалении через backspace.
  if (digits.length > 3) out += ") " + digits.slice(3, 6);
  if (digits.length > 6) out += "-" + digits.slice(6, 8);
  if (digits.length > 8) out += "-" + digits.slice(8, 10);
  return out;
}

function PhoneField() {
  const [digits, setDigits] = useState("");
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const invalid = digits.length !== 10;
  const showError = touched && invalid;

  // Блокируем нативную отправку формы, пока номер не заполнен полностью.
  useEffect(() => {
    ref.current?.setCustomValidity(invalid ? "Введите номер телефона полностью" : "");
  }, [invalid]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.replace(/\D/g, "");
    // Первая цифра — всегда «7» из префикса (или вставленная 7/8 при пасте): убираем её.
    if (raw[0] === "7" || raw[0] === "8") raw = raw.slice(1);
    setDigits(raw.slice(0, 10));
  }

  return (
    <div>
      <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
        Телефон
      </label>
      <input
        ref={ref}
        id="phone"
        name="phone"
        type="tel"
        inputMode="tel"
        required
        placeholder="+7 (999) 999-99-99"
        value={digits === "" ? "" : formatPhone(digits)}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-sm outline-none transition-colors placeholder:text-muted/60 ${
          showError
            ? "border-red-500 focus:border-red-500"
            : "border-black/10 focus:border-brand"
        }`}
      />
      {showError && (
        <p className="mt-1.5 text-xs text-red-600">
          Введите номер телефона полностью — 10 цифр после +7.
        </p>
      )}
    </div>
  );
}

// E-mail необязателен: пустое поле — валидно. Если заполнено — требуем @ и точку
// в домене (хотя бы одна зона: .ру / .com / .su и т.п.).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailField() {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const invalid = value !== "" && !EMAIL_RE.test(value);
  const showError = touched && invalid;

  useEffect(() => {
    ref.current?.setCustomValidity(invalid ? "Введите e-mail в формате имя@домен.ру" : "");
  }, [invalid]);

  return (
    <div>
      <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
        E-mail
      </label>
      <input
        ref={ref}
        id="email"
        name="email"
        type="email"
        inputMode="email"
        placeholder="название_почты@домен.ру"
        value={value}
        onChange={(e) => setValue(e.target.value.trim())}
        onBlur={() => setTouched(true)}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-sm outline-none transition-colors placeholder:text-muted/60 ${
          showError
            ? "border-red-500 focus:border-red-500"
            : "border-black/10 focus:border-brand"
        }`}
      />
      {showError && (
        <p className="mt-1.5 text-xs text-red-600">
          Проверьте e-mail: нужен знак @ и домен с точкой, например имя@домен.ру.
        </p>
      )}
    </div>
  );
}

// ИНН обязателен. Формат/контрольная сумма — офлайн (мгновенно), существование —
// через Checko на blur. Отправку блокируем, пока идёт проверка или юрлицо не найдено.
type InnCheck = {
  state: "idle" | "loading" | "found" | "not_found";
  name?: string;
  kind?: "org" | "ip";
};

function InnField() {
  const [inn, setInn] = useState("");
  const [touched, setTouched] = useState(false);
  const [check, setCheck] = useState<InnCheck>({ state: "idle" });
  const ref = useRef<HTMLInputElement>(null);

  const formatOk = isValidInn(inn);
  const kind: "org" | "ip" = inn.length === 12 ? "ip" : "org";
  const orgNotFound = check.state === "not_found" && kind === "org";
  const blocking = !formatOk || check.state === "loading" || orgNotFound;
  const showError = touched && ((inn.length > 0 && !formatOk) || orgNotFound);

  useEffect(() => {
    let msg = "";
    if (!inn) msg = "Укажите ИНН";
    else if (!formatOk) msg = "ИНН должен состоять из 10 или 12 цифр";
    else if (check.state === "loading") msg = "Идёт проверка ИНН";
    else if (orgNotFound) msg = "Организация с таким ИНН не найдена";
    ref.current?.setCustomValidity(blocking ? msg : "");
  }, [blocking, inn, formatOk, check.state, orgNotFound]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInn(normalizeInn(e.target.value));
    setCheck({ state: "idle" });
  }

  async function onBlur() {
    setTouched(true);
    if (!isValidInn(inn)) return;
    setCheck({ state: "loading" });
    try {
      const res = await fetch(`/api/inn?inn=${inn}`);
      const data = await res.json();
      if (data.status === "found") setCheck({ state: "found", name: data.name, kind: data.kind });
      else if (data.status === "not_found") setCheck({ state: "not_found", kind: data.kind });
      else setCheck({ state: "idle" }); // error/unconfigured — не мешаем отправке
    } catch {
      setCheck({ state: "idle" });
    }
  }

  return (
    <div>
      <label htmlFor="inn" className="mb-1.5 block text-sm font-medium">
        ИНН компании или ИП
      </label>
      <input
        ref={ref}
        id="inn"
        name="inn"
        inputMode="numeric"
        required
        placeholder="10 или 12 цифр"
        value={inn}
        onChange={onChange}
        onBlur={onBlur}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-sm outline-none transition-colors placeholder:text-muted/60 ${
          showError ? "border-red-500 focus:border-red-500" : "border-black/10 focus:border-brand"
        }`}
      />
      {showError ? (
        <p className="mt-1.5 text-xs text-red-600">
          {orgNotFound
            ? "Организация с таким ИНН не найдена — проверьте номер."
            : "Проверьте ИНН: 10 цифр для компании или 12 для ИП / физлица."}
        </p>
      ) : check.state === "loading" ? (
        <p className="mt-1.5 text-xs text-muted">Проверяем ИНН…</p>
      ) : check.state === "found" ? (
        <p className="mt-1.5 text-xs text-brand">✓ {check.name || "Найдено в реестре"}</p>
      ) : check.state === "not_found" && kind === "ip" ? (
        <p className="mt-1.5 text-xs text-muted">
          В реестре ИП не найдено — оформим как физлицо.
        </p>
      ) : null}
    </div>
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
        className="h-12 w-full rounded-xl border border-black/10 bg-paper px-4 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-brand"
        {...props}
      />
    </div>
  );
}
