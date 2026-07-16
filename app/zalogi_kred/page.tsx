import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import StickyCTA from "@/components/site/StickyCTA";
import Reveal from "@/components/site/Reveal";
import PledgeCalculator from "@/components/zalogi/PledgeCalculator";
import PledgeForm from "@/components/zalogi/PledgeForm";
import FaqList from "@/components/site/FaqList";
import { CONTACTS } from "@/lib/site";
import { PROPERTY_GROUPS, ZALOGI_CASES, ZALOGI_FAQ, ZALOGI_PROCESS, ZALOGI_STATS } from "@/lib/zalogi";

// Своя метаинформация: страница должна находиться по своему запросу, а не дублировать главную
export const metadata: Metadata = {
  title: "Кредит под залог недвижимости для бизнеса и физлиц — KOVI Finance",
  description:
    "Кредиты под залог квартиры, дома, офиса, склада или земли. До 2 млрд ₽, до 70% от стоимости объекта. Работаем с юрлицами, ИП и физлицами.",
  alternates: { canonical: "https://kovifinance.ru/zalogi_kred" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "Кредит под залог недвижимости",
  url: "https://kovifinance.ru/zalogi_kred",
  provider: { "@type": "FinancialService", name: "KOVI Finance", url: "https://kovifinance.ru" },
  description:
    "Кредиты под залог ликвидной недвижимости — жилой, коммерческой и особых объектов. Для юридических лиц, ИП и физических лиц.",
  areaServed: "RU",
};

export default function ZalogiKredPage() {
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
              <h1 className="rise text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Кредит под залог <span className="text-gold-bright">недвижимости</span>
              </h1>
              <p className="rise mt-6 max-w-2xl text-lg text-white/70">
                Деньги под квартиру, дом, офис, склад или землю — без продажи объекта. Работаем
                с юридическими лицами, ИП и физлицами. Оплата только по факту получения денег.
              </p>

              <div className="rise mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#lead"
                  className="rounded-full bg-brand px-7 py-3.5 text-center font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark"
                >
                  Оставить заявку
                </a>
                <a
                  href="#calc"
                  className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Рассчитать сумму
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
              {ZALOGI_STATS.map((s) => (
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

        {/* Что берём в залог */}
        <section id="objects" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              Что берём <span className="text-brand">в залог</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Чем ликвиднее объект, тем больше сумма и ниже ставка. Сложные объекты тоже
              рассматриваем — просто на других условиях.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PROPERTY_GROUPS.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    до {Math.round(g.ltv * 100)}% от стоимости
                  </p>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{g.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{g.note}</p>
                  <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <PledgeCalculator />

        {/* Как проходит сделка */}
        <section id="process" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              Четыре шага до <span className="text-brand">денег</span>
            </h2>
            <p className="mt-4 text-lg text-muted">
              Берём на себя оценку, банки и оформление залога. Вы занимаетесь в это время своим
              бизнесом.
            </p>
          </Reveal>

          <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ZALOGI_PROCESS.map((s, i) => (
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

        {/* Кейсы */}
        <section id="cases" className="bg-ink py-20 text-paper md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
                Сделки, которые <span className="text-gold-bright">закрыли</span>
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {ZALOGI_CASES.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      {c.tag}
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-gold-bright">
                      {c.metric}
                    </p>
                    <h3 className="mt-3 font-semibold tracking-tight text-white">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <FaqList
          title={
            <>
              Вопросы про <span className="text-brand">залог</span>
            </>
          }
          items={ZALOGI_FAQ}
        />
        <PledgeForm />
      </main>

      <Footer />
      <StickyCTA />
    </>
  );
}
