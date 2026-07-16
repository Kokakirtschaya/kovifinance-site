import Image from "next/image";
import { STATS, CONTACTS } from "@/lib/site";
import CountUp from "@/components/site/CountUp";
import MagneticButton from "@/components/site/MagneticButton";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-paper">
      {/* градиентная глубина */}
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #1e7a57 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, #d4a017 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Текст */}
          <div>
            <p className="rise mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-bright">
              Куём капитал
            </p>
            <h1 className="rise text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
              Финансирование для бизнеса —{" "}
              <span className="text-gold-bright">быстро</span> и без лишней бюрократии
            </h1>

            <p className="rise mt-6 max-w-xl text-lg text-white/70">
              Подберём кредит, гарантию, факторинг или лизинг на выгодных условиях. Работаем
              с 40+ банками. Заявка — 5 минут, решение — от 3 дней. Оплата только за результат.
            </p>

            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row">
              <MagneticButton
                href="#lead"
                className="rounded-full bg-brand px-7 py-3.5 text-center font-semibold text-white shadow-lg hover:bg-brand-dark"
              >
                Получить финансирование
              </MagneticButton>
              <MagneticButton
                href="#calc"
                className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white hover:bg-white/10"
              >
                Рассчитать условия
              </MagneticButton>
            </div>

            <p className="rise mt-4 text-sm text-white/50">
              Или позвоните:{" "}
              <a href={CONTACTS.phoneHref} className="text-white/80 underline underline-offset-4">
                {CONTACTS.phone}
              </a>
            </p>
          </div>

          {/* Изображение */}
          <div className="hidden lg:block">
            <div className="rise relative aspect-[1528/2128] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                src="/brand/hero-owner.png"
                alt="Эксперт по финансированию KOVI Finance"
                fill
                sizes="45vw"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Первой колонке места больше: «более 20 млрд ₽» вдвое длиннее соседей и при
            равных долях не влезал — ~270px текста в 260px колонки, ₽ отрывался на строку ниже. */}
        <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="text-3xl font-semibold tracking-tight text-gold-bright md:whitespace-nowrap md:text-4xl">
                {s.num !== undefined ? (
                  <CountUp to={s.num} prefix={s.prefix ?? ""} suffix={s.suffix ?? ""} />
                ) : (
                  s.text
                )}
              </dt>
              <dd className="mt-1 text-sm text-white/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
