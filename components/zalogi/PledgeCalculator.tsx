"use client";

import { useMemo, useState } from "react";
import Reveal from "@/components/site/Reveal";
import { KEY_RATE, PROPERTY_GROUPS } from "@/lib/zalogi";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

export default function PledgeCalculator() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [price, setPrice] = useState(30_000_000);
  const [want, setWant] = useState(15_000_000);
  const [term, setTerm] = useState(60);

  const calc = useMemo(() => {
    const g = PROPERTY_GROUPS[groupIdx];
    // Считаем от оценки объекта, а не от запроса: сколько дадут — решает залог
    const limit = price * g.ltv;
    const sum = Math.min(want, limit);
    const capped = want > limit;

    const rate = KEY_RATE + g.spread;
    const n = Math.max(1, term);
    const r = rate / 100 / 12;
    const monthly = r > 0 ? (sum * r) / (1 - Math.pow(1 + r, -n)) : sum / n;

    return { limit, sum, capped, rate, monthly, total: monthly * n, ltv: g.ltv };
  }, [groupIdx, price, want, term]);

  return (
    <section id="calc" className="bg-paper-2/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
            Сколько дадут <span className="text-brand">под ваш объект</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Сумма зависит от оценки недвижимости и её типа. Расчёт предварительный — точные
            условия подберём после оценки.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="rounded-3xl border border-black/[0.07] bg-white p-5 shadow-[var(--shadow-soft)] md:p-8">
            <div className="flex flex-wrap gap-1 rounded-2xl bg-paper-2 p-1 sm:inline-flex sm:rounded-full">
              {PROPERTY_GROUPS.map((g, i) => (
                <button
                  key={g.title}
                  onClick={() => setGroupIdx(i)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    groupIdx === i ? "bg-ink text-white" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {g.title}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.35fr_1fr]">
              <div className="space-y-5">
                <Field
                  label="Стоимость объекта"
                  suffix="₽"
                  value={price}
                  onChange={setPrice}
                  min={1_000_000}
                  max={1_000_000_000}
                  step={500_000}
                  money
                  slider
                />
                <Field
                  label="Нужная сумма"
                  suffix="₽"
                  value={want}
                  onChange={setWant}
                  min={1_000_000}
                  max={2_000_000_000}
                  step={500_000}
                  money
                  slider
                />
                <Field
                  label="Срок"
                  suffix="мес."
                  value={term}
                  onChange={setTerm}
                  min={12}
                  max={240}
                />
                {calc.capped && (
                  <p className="rounded-xl bg-brand-soft px-4 py-3 text-sm text-brand-dark">
                    Под такой объект дадут до {fmt(calc.limit)} ₽ — это {Math.round(calc.ltv * 100)}%
                    от его стоимости. Расчёт ниже по этой сумме.
                  </p>
                )}
              </div>

              <div className="flex flex-col justify-between rounded-2xl bg-ink p-6 text-paper">
                <div>
                  <p className="text-sm text-white/60">Доступная сумма</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-gold-bright md:text-4xl">
                    {fmt(calc.sum)} <span className="text-xl text-gold-bright/70">₽</span>
                  </p>

                  <dl className="mt-5 space-y-2.5 text-sm">
                    <Row label="Платёж в месяц" value={`${fmt(calc.monthly)} ₽`} />
                    <Row
                      label="Предварительная ставка"
                      value={`${calc.rate.toFixed(1).replace(".", ",")}% год.`}
                    />
                    <Row label="Общая сумма выплат" value={`${fmt(calc.total)} ₽`} />
                  </dl>
                </div>

                <a
                  href="#lead"
                  className="mt-6 rounded-full bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Оставить заявку и получить точный расчёт
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-muted">
          Расчёт носит информационный характер и не является публичной офертой. Ставка считается
          от ключевой ставки ЦБ ({KEY_RATE}%) и зависит от типа объекта.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
      <dt className="text-white/60">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

function Field({
  label,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  money = false,
  slider = false,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  money?: boolean;
  slider?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm text-muted">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-black/10 bg-paper pr-2 transition-colors focus-within:border-brand">
        {money ? (
          <input
            type="text"
            inputMode="numeric"
            value={fmt(value)}
            onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "") || 0))}
            className="w-full bg-transparent px-4 py-2.5 text-sm font-medium outline-none"
          />
        ) : (
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-transparent px-4 py-2.5 text-sm font-medium outline-none"
          />
        )}
        {suffix && <span className="whitespace-nowrap text-sm text-muted">{suffix}</span>}
      </div>
      {slider && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-3 w-full"
        />
      )}
    </label>
  );
}
