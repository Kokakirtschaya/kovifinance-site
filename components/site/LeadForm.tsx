"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import { isValidInn, normalizeInn } from "@/lib/inn";
import { LEAD_LIMITS } from "@/lib/lead-validation";
import Reveal from "@/components/site/Reveal";
import PdConsentCheckbox from "@/components/site/PdConsentCheckbox";

type Status = "idle" | "sending" | "ok" | "error";

const SEND_ERRORS: Record<string, string> = {
  rate: "Слишком много попыток. Попробуйте через 15 минут или позвоните нам.",
  validation: "Проверьте имя, телефон, e-mail и выбранный продукт.",
  inn_invalid: "Проверьте ИНН: нужны 10 или 12 цифр с верной контрольной суммой.",
  inn_not_found: "Организация с таким ИНН не найдена. Проверьте номер.",
  consent: "Отметьте согласие на обработку персональных данных.",
  consent_version: "Условия согласия обновились. Обновите страницу, ознакомьтесь с ними и отметьте согласие заново.",
};
const DELIVERY_ERROR =
  "Не удалось подтвердить отправку. Введённые данные сохранены в форме. Попробуйте ещё раз или позвоните нам.";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submitting = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting.current) return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.pdConsent !== "on") {
      setErrorMessage(SEND_ERRORS.consent);
      setStatus("error");
      return;
    }

    submitting.current = true;
    setErrorMessage("");
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(35_000),
      });
      const result = await res.json();
      if (!res.ok || result?.ok !== true) {
        setErrorMessage(
          typeof result?.error === "string"
            ? SEND_ERRORS[result.error] ?? DELIVERY_ERROR
            : DELIVERY_ERROR,
        );
        setStatus("error");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setErrorMessage(DELIVERY_ERROR);
      setStatus("error");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section id="lead" className={`${SHELL} section-space`}>
      <Reveal>
      <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-white lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col justify-between bg-ink p-6 text-paper sm:p-8 lg:p-10">
          <div>
            <p className="eyebrow mb-4 text-[#d9bd75]">Первый шаг</p>
            <h2 className="section-heading max-w-[16ch]">Обсудим вашу задачу</h2>
            <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-white/70 sm:text-base">
              Оставьте контакты. Перезвоним в течение дня, разберём ситуацию и оценим варианты финансирования.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/60 sm:text-sm">Первая консультация бесплатна. Без предоплаты.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm lg:mt-12 lg:block lg:space-y-3">
            <a href={CONTACTS.phoneHref} className="block font-medium text-white">{CONTACTS.phone}</a>
            <a href={CONTACTS.emailHref} className="block text-white/70 hover:text-white">{CONTACTS.email}</a>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          {status === "ok" ? (
            <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
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
            <form onSubmit={onSubmit} aria-busy={status === "sending"} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Имя" placeholder="Как к вам обращаться" autoComplete="name" maxLength={LEAD_LIMITS.name} required />
                <PhoneField />
              </div>
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
                <label htmlFor="product" className="mb-1.5 block text-sm font-medium">Что интересует</label>
                <select
                  id="product"
                  name="product"
                  defaultValue=""
                  className="h-12 w-full rounded-xl border border-black/10 bg-paper px-4 text-base outline-none transition-colors focus:border-brand"
                >
                  <option value="" disabled>Выберите продукт</option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Другое">Другое / не знаю</option>
                </select>
              </div>

              <PdConsentCheckbox id="lead-pd-consent" />

              <button
                type="submit"
                disabled={status === "sending"}
                className="button-primary w-full disabled:opacity-60"
              >
                {status === "sending" ? "Отправляем…" : "Отправить заявку"}
              </button>

              {status === "error" && (
                <p role="alert" className="text-sm text-red-600">
                  {errorMessage}{" "}
                  <a href={CONTACTS.phoneHref} className="underline">{CONTACTS.phone}</a>
                </p>
              )}
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
        maxLength={LEAD_LIMITS.phone}
        required
        placeholder="+7 (999) 999-99-99"
        value={digits === "" ? "" : formatPhone(digits)}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-base outline-none transition-colors placeholder:text-muted/60 ${
          showError
            ? "border-red-500 focus:border-red-500"
            : "border-black/10 focus:border-brand"
        }`}
      />
      {showError && (
        <p className="mt-1.5 text-xs text-red-600">
          Введите номер телефона полностью: 10 цифр после +7.
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
        maxLength={LEAD_LIMITS.email}
        placeholder="название_почты@домен.ру"
        value={value}
        onChange={(e) => setValue(e.target.value.trim())}
        onBlur={() => setTouched(true)}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-base outline-none transition-colors placeholder:text-muted/60 ${
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
  const lookupController = useRef<AbortController | null>(null);

  useEffect(() => () => lookupController.current?.abort(), []);

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
    lookupController.current?.abort();
    setInn(normalizeInn(e.target.value));
    setCheck({ state: "idle" });
  }

  async function onBlur() {
    setTouched(true);
    if (!isValidInn(inn)) return;
    lookupController.current?.abort();
    const controller = new AbortController();
    lookupController.current = controller;
    setCheck({ state: "loading" });
    try {
      const res = await fetch(`/api/inn?inn=${inn}`, {
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(7000)]),
      });
      const data = await res.json();
      if (controller.signal.aborted) return;
      if (data.status === "found") setCheck({ state: "found", name: data.name, kind: data.kind });
      else if (data.status === "not_found") setCheck({ state: "not_found", kind: data.kind });
      else setCheck({ state: "idle" }); // error/unconfigured — не мешаем отправке
    } catch {
      if (!controller.signal.aborted) setCheck({ state: "idle" });
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
        maxLength={LEAD_LIMITS.inn}
        required
        placeholder="10 или 12 цифр"
        value={inn}
        onChange={onChange}
        onBlur={onBlur}
        onInvalid={() => setTouched(true)}
        aria-invalid={showError}
        className={`h-12 w-full rounded-xl border bg-paper px-4 text-base outline-none transition-colors placeholder:text-muted/60 ${
          showError ? "border-red-500 focus:border-red-500" : "border-black/10 focus:border-brand"
        }`}
      />
      {showError ? (
        <p className="mt-1.5 text-xs text-red-600">
          {orgNotFound
            ? "Организация с таким ИНН не найдена, проверьте номер."
            : "Проверьте ИНН: 10 цифр для компании или 12 для ИП / физлица."}
        </p>
      ) : check.state === "loading" ? (
        <p className="mt-1.5 text-xs text-muted">Проверяем ИНН…</p>
      ) : check.state === "found" ? (
        <p className="mt-1.5 text-xs text-brand">✓ {check.name || "Найдено в реестре"}</p>
      ) : check.state === "not_found" && kind === "ip" ? (
        <p className="mt-1.5 text-xs text-muted">
          В реестре ИП не найдено, оформим как физлицо.
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
        className="h-12 w-full rounded-xl border border-black/10 bg-paper px-4 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-brand"
        {...props}
      />
    </div>
  );
}
