import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import Reveal from "@/components/site/Reveal";
import FaqList from "@/components/site/FaqList";
import AsvForm from "@/components/asv/AsvForm";
import { CONTACTS } from "@/lib/site";
import { ASV_BENEFITS, ASV_FAQ, ASV_PROCESS, ASV_STATS } from "@/lib/asv";

export const metadata: Metadata = {
  title: "Финансирование торгов АСВ под залог недвижимости — KOVI Finance",
  description:
    "Деньги на участие в торгах АСВ под залог вашей недвижимости. До 70% от стоимости залога, до 500 млн ₽, решение за 3 дня. Имущество банков-банкротов на 20–30% ниже рынка.",
  alternates: { canonical: "https://kovifinance.ru/asv_kred" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "Финансирование торгов АСВ",
  url: "https://kovifinance.ru/asv_kred",
  provider: { "@type": "FinancialService", name: "KOVI Finance", url: "https://kovifinance.ru" },
  description:
    "Кредиты под залог недвижимости на участие в торгах Агентства по страхованию вкладов и покупку имущества банков-банкротов.",
  areaServed: "RU",
};

export default function AsvKredPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Герой */}
        <section id="top" className="relative overflow-hidden bg-ink text-paper">
          <div className="grain pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-12 md:pt-20">
            <div className="max-w-3xl">
              <p className="rise text-sm font-semibold uppercase tracking-widest text-gold-bright">
                Торги АСВ
              </p>
              <h1 className="rise mt-3 text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Финансирование для участия в{" "}
                <span className="text-gold-bright">торгах АСВ</span>
              </h1>
              <p className="rise mt-6 max-w-2xl text-lg text-white/70">
                Имущество банков-банкротов уходит с торгов на 20–30% ниже рынка. Даём деньги под
                залог вашей недвижимости — чтобы вы шли на торги с подтверждённым лимитом, а не
                с надеждой успеть.
              </p>

              <div className="rise mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lead"
                  className="rounded-full bg-brand px-7 py-3.5 text-center font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark"
                >
                  Оставить заявку
                </a>
                <a
                  href="#how"
                  className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Как это работает
                </a>
              </div>

              <p className="rise mt-4 text-sm text-white/50">
                Или позвоните:{" "}
                <a href={CONTACTS.phoneHref} className="text-white/80 underline underline-offset-4">
                  {CONTACTS.phone}
                </a>
              </p>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 md:grid-cols-4">
              {ASV_STATS.map((s) => (
                <div key={s.label}>
                  <dt className="text-3xl font-semibold tracking-tight text-gold-bright md:whitespace-nowrap md:text-4xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-sm text-white/60">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Как это работает */}
        <section id="how" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              От выбора лота до <span className="text-brand">ключей</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Четыре шага. Главное — деньги готовы заранее, поэтому на торгах вы уверены в своём
              потолке.
            </p>
          </Reveal>

          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ASV_PROCESS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <li className="flex gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand-dark">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* Почему выгодно */}
        <section className="bg-paper-2/60 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
                Почему это <span className="text-brand">выгодно</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ASV_BENEFITS.map((b, i) => (
                <Reveal key={b.title} delay={i * 0.06} className="h-full">
                  <div className="h-full rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)]">
                    <h3 className="font-semibold tracking-tight">{b.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FaqList
          title={
            <>
              Вопросы про <span className="text-brand">торги АСВ</span>
            </>
          }
          items={ASV_FAQ}
        />
        <AsvForm />
      </main>

      <Footer />
      <StickyCTA />
    </>
  );
}
