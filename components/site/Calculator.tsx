"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Reveal from "@/components/site/Reveal";
import { SHELL } from "@/lib/layout";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n || 0));

type Mode = "credit" | "bg" | "factoring" | "leasing";

const MODES: { key: Mode; label: string }[] = [
  { key: "credit", label: "Кредит" },
  { key: "bg", label: "Банковская гарантия" },
  { key: "factoring", label: "Факторинг" },
  { key: "leasing", label: "Лизинг" },
];

export default function Calculator() {
  const [mode, setMode] = useState<Mode>("credit");

  // Кредит
  const [amount, setAmount] = useState(100_000_000);
  const [term, setTerm] = useState(24);
  const [termUnit, setTermUnit] = useState<"m" | "y">("m");
  const [rate, setRate] = useState(17);
  const [payType, setPayType] = useState<"ann" | "diff">("ann");

  // Банковская гарантия
  const [bgAmount, setBgAmount] = useState(100_000_000);
  const [days, setDays] = useState(180);
  const [bgRate, setBgRate] = useState(3);

  // Факторинг
  const [facAmount, setFacAmount] = useState(50_000_000);
  const [facAdvance, setFacAdvance] = useState(90);
  const [facDays, setFacDays] = useState(60);
  const [facRate, setFacRate] = useState(19);

  // Лизинг
  const [leaseCost, setLeaseCost] = useState(50_000_000);
  const [leaseDown, setLeaseDown] = useState(20);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [leaseRateType, setLeaseRateType] = useState<"apr" | "markup">("apr");
  // Раздельные значения: 16% годовых и 7% удорожания — разные шкалы, переключение не должно их путать
  const [leaseApr, setLeaseApr] = useState(16);
  const [leaseMarkup, setLeaseMarkup] = useState(7);

  const credit = useMemo(() => {
    const n = Math.max(1, termUnit === "y" ? term * 12 : term);
    const r = rate / 100 / 12;
    if (payType === "ann") {
      const m = r > 0 ? (amount * r) / (1 - Math.pow(1 + r, -n)) : amount / n;
      const total = m * n;
      return { label: "Ежемесячный платёж", primary: m, over: total - amount, total };
    }
    const principal = amount / n;
    const first = principal + amount * r;
    const interest = amount * r * (n + 1) / 2;
    return { label: "Первый платёж", primary: first, over: interest, total: amount + interest };
  }, [amount, term, termUnit, rate, payType]);

  const bg = useMemo(() => {
    const cost = bgAmount * (bgRate / 100) * (days / 365);
    const months = Math.max(1, days / 30.4);
    return { cost: Math.max(cost, 0), monthly: cost / months };
  }, [bgAmount, days, bgRate]);

  const factoring = useMemo(() => {
    const advance = facAmount * (facAdvance / 100);
    const cost = advance * (facRate / 100) * (facDays / 365);
    return { advance, cost, rest: Math.max(facAmount - advance - cost, 0) };
  }, [facAmount, facAdvance, facDays, facRate]);

  const leasing = useMemo(() => {
    const n = Math.max(1, leaseTerm);
    const years = n / 12;
    const down = leaseCost * (leaseDown / 100);

    let monthly: number;
    let total: number;
    if (leaseRateType === "markup") {
      // Удорожание считают от полной стоимости предмета за год, а не от остатка долга
      total = leaseCost * (1 + (leaseMarkup / 100) * years);
      monthly = (total - down) / n;
    } else {
      const financed = Math.max(leaseCost - down, 0);
      const r = leaseApr / 100 / 12;
      monthly = r > 0 ? (financed * r) / (1 - Math.pow(1 + r, -n)) : financed / n;
      total = down + monthly * n;
    }

    const over = total - leaseCost;
    return { monthly, down, total, over, perYear: leaseCost > 0 ? over / leaseCost / years * 100 : 0 };
  }, [leaseCost, leaseDown, leaseTerm, leaseRateType, leaseApr, leaseMarkup]);

  // Единый результат — иначе панель справа разрастается в ветвление на четыре продукта
  const result = useMemo((): { label: string; primary: number; rows: [string, string][] } => {
    switch (mode) {
      case "credit":
        return {
          label: credit.label,
          primary: credit.primary,
          rows: [
            ["Переплата", `${fmt(credit.over)} ₽`],
            ["Общая сумма выплат", `${fmt(credit.total)} ₽`],
          ],
        };
      case "bg":
        return {
          label: "Итоговая стоимость",
          primary: bg.cost,
          rows: [
            ["Ежемесячная стоимость", `${fmt(bg.monthly)} ₽`],
            ["Срок гарантии", `${days} дн.`],
          ],
        };
      case "factoring":
        return {
          label: "Получите сразу после отгрузки",
          primary: factoring.advance,
          rows: [
            ["Стоимость факторинга", `${fmt(factoring.cost)} ₽`],
            ["Остаток после оплаты дебитором", `${fmt(factoring.rest)} ₽`],
            ["Отсрочка", `${facDays} дн.`],
          ],
        };
      case "leasing":
        return {
          label: "Ежемесячный платёж",
          primary: leasing.monthly,
          rows: [
            ["Аванс", `${fmt(leasing.down)} ₽`],
            [
              "Удорожание за срок",
              `${fmt(leasing.over)} ₽ · ${leasing.perYear.toFixed(1).replace(".", ",")}% в год`,
            ],
            ["Сумма договора", `${fmt(leasing.total)} ₽`],
          ],
        };
    }
  }, [mode, credit, bg, days, factoring, facDays, leasing]);

  return (
    <section id="calc" className="bg-ink py-20 text-paper md:py-28">
      <div className={SHELL}>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            Рассчитайте условия <span className="text-gold-bright">за минуту</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Кредит, банковская гарантия, факторинг и лизинг в одном окне. Предварительный расчёт;
            точные условия подберём под ваш бизнес.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="rounded-3xl border border-white/10 bg-ink-2 p-5 shadow-2xl md:p-8">
            {/* Переключатель продукта */}
            <div className="flex flex-wrap gap-1 rounded-2xl bg-white/5 p-1 sm:inline-flex sm:rounded-full">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    mode === m.key ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {mode === m.key && (
                    <motion.span
                      layoutId="calc-tab"
                      className="absolute inset-0 rounded-full bg-brand"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.35fr_1fr]">
              {/* Поля ввода */}
              <div className="space-y-5">
                {mode === "credit" && (
                  <>
                    <NumberField
                      label="Сумма кредита"
                      suffix="₽"
                      value={amount}
                      onChange={setAmount}
                      min={30_000_000}
                      max={1_000_000_000}
                      step={1_000_000}
                      slider
                      money
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="Срок"
                        value={term}
                        onChange={setTerm}
                        min={1}
                        max={termUnit === "y" ? 30 : 360}
                        suffixToggle={{
                          value: termUnit,
                          options: [
                            { key: "m", label: "мес." },
                            { key: "y", label: "лет" },
                          ],
                          onChange: (v) => setTermUnit(v as "m" | "y"),
                        }}
                      />
                      <NumberField
                        label="Ставка"
                        suffix="% год."
                        value={rate}
                        onChange={setRate}
                        min={1}
                        max={60}
                        step={0.1}
                      />
                    </div>
                    <Toggle
                      label="Тип платежей"
                      value={payType}
                      options={[
                        { key: "ann", label: "Аннуитетные" },
                        { key: "diff", label: "Дифференц." },
                      ]}
                      onChange={(v) => setPayType(v as "ann" | "diff")}
                    />
                  </>
                )}

                {mode === "bg" && (
                  <>
                    <NumberField
                      label="Сумма гарантии"
                      suffix="₽"
                      value={bgAmount}
                      onChange={setBgAmount}
                      min={30_000_000}
                      max={1_000_000_000}
                      step={1_000_000}
                      slider
                      money
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="Срок действия"
                        suffix="дней"
                        value={days}
                        onChange={setDays}
                        min={1}
                        max={1825}
                      />
                      <NumberField
                        label="Ставка комиссии"
                        suffix="% год."
                        value={bgRate}
                        onChange={setBgRate}
                        min={0.5}
                        max={20}
                        step={0.1}
                      />
                    </div>
                  </>
                )}

                {mode === "factoring" && (
                  <>
                    <NumberField
                      label="Сумма поставки"
                      suffix="₽"
                      value={facAmount}
                      onChange={setFacAmount}
                      min={1_000_000}
                      max={500_000_000}
                      step={1_000_000}
                      slider
                      money
                    />
                    <NumberField
                      label="Процент финансирования"
                      suffix="%"
                      value={facAdvance}
                      onChange={setFacAdvance}
                      min={50}
                      max={100}
                      step={1}
                      slider
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="Отсрочка платежа"
                        suffix="дней"
                        value={facDays}
                        onChange={setFacDays}
                        min={1}
                        max={180}
                      />
                      <NumberField
                        label="Ставка"
                        suffix="% год."
                        value={facRate}
                        onChange={setFacRate}
                        min={1}
                        max={60}
                        step={0.1}
                      />
                    </div>
                  </>
                )}

                {mode === "leasing" && (
                  <>
                    <NumberField
                      label="Стоимость предмета лизинга"
                      suffix="₽"
                      value={leaseCost}
                      onChange={setLeaseCost}
                      min={1_000_000}
                      max={300_000_000}
                      step={500_000}
                      slider
                      money
                    />
                    <NumberField
                      label="Аванс"
                      suffix="%"
                      value={leaseDown}
                      onChange={setLeaseDown}
                      min={0}
                      max={49}
                      step={1}
                      slider
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <NumberField
                        label="Срок"
                        suffix="мес."
                        value={leaseTerm}
                        onChange={setLeaseTerm}
                        min={12}
                        max={84}
                      />
                      <NumberField
                        label="Ставка"
                        value={leaseRateType === "apr" ? leaseApr : leaseMarkup}
                        onChange={leaseRateType === "apr" ? setLeaseApr : setLeaseMarkup}
                        min={0.5}
                        max={leaseRateType === "apr" ? 60 : 30}
                        step={0.1}
                        suffixToggle={{
                          value: leaseRateType,
                          options: [
                            { key: "apr", label: "% год." },
                            { key: "markup", label: "% удорож." },
                          ],
                          onChange: (v) => setLeaseRateType(v as "apr" | "markup"),
                        }}
                      />
                    </div>
                    <p className="text-xs text-white/50">
                      {leaseRateType === "apr"
                        ? "Процентная ставка на сумму за вычетом аванса, как в кредите."
                        : "Удорожание от стоимости предмета за год, как считают лизинговые компании."}
                    </p>
                  </>
                )}
              </div>

              {/* Результат */}
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-brand-dark p-6 text-paper">
                <div>
                  <p className="text-sm text-white/60">{result.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-gold-bright md:text-4xl">
                    {fmt(result.primary)} <span className="text-xl text-gold-bright/70">₽</span>
                  </p>

                  <dl className="mt-5 space-y-2.5 text-sm">
                    {result.rows.map(([label, value]) => (
                      <Row key={label} label={label} value={value} />
                    ))}
                  </dl>
                </div>

                <a
                  href="#lead"
                  className="press mt-6 rounded-full bg-brand px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-brand-dark"
                >
                  Оставить заявку и получить точный расчёт
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="mt-4 text-xs text-white/50">
          Расчёт носит информационный характер и не является публичной офертой.
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

type ToggleOpt = { key: string; label: string };

function NumberField({
  label,
  suffix,
  value,
  onChange,
  min,
  max,
  step = 1,
  slider = false,
  money = false,
  suffixToggle,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  slider?: boolean;
  money?: boolean;
  suffixToggle?: { value: string; options: ToggleOpt[]; onChange: (v: string) => void };
}) {
  return (
    <label className="block">
      <span className="text-sm text-white/60">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 pr-2 transition-colors focus-within:border-brand">
        {money ? (
          <input
            type="text"
            inputMode="numeric"
            value={fmt(value)}
            onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "") || 0))}
            className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-white outline-none"
          />
        ) : (
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        )}
        {suffix && <span className="whitespace-nowrap text-sm text-white/50">{suffix}</span>}
        {suffixToggle && (
          <div className="flex shrink-0 rounded-lg bg-white/10 p-0.5">
            {suffixToggle.options.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => suffixToggle.onChange(o.key)}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  suffixToggle.value === o.key ? "bg-white text-ink shadow-sm" : "text-white/50"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {slider && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={Math.min(Math.max(value, min), max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
        />
      )}
    </label>
  );
}

function Toggle({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: ToggleOpt[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="text-sm text-white/60">{label}</span>
      <div className="mt-1.5 inline-flex rounded-xl bg-white/10 p-1">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => onChange(o.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              value === o.key ? "bg-white text-ink shadow-sm" : "text-white/60 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
