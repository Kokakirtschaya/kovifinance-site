import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SiteIcon from "@/components/site/SiteIcon";
import { CASE_STUDIES } from "@/lib/cases";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Кейсы из практики Коки Кирцхая",
  description:
    "Банковские гарантии, рефинансирование и кредиты: семь сделок из практики основателя KOVI Finance. Задачи клиентов, сложности, принятые решения и результаты.",
  alternates: { canonical: "/cases" },
};

export default function CasesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-ink text-paper">
          <div className={`${SHELL} section-space`}>
            <Link href="/#cases" className="mb-8 inline-flex min-h-10 items-center text-sm text-white/65 hover:text-white">
              ← На главную
            </Link>
            <p className="eyebrow mb-5 text-[#d9bd75]">Из практики Коки Кирцхая</p>
            <h1 className="max-w-[20ch] text-[clamp(2.25rem,4.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
              Сделки и решения
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-white/75 sm:text-lg">
              Семь задач бизнеса и собственников: что мешало получить финансирование,
              какую структуру удалось согласовать и чем завершилась сделка.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Имена клиентов и суммы сделок не раскрываются.
            </p>
          </div>
        </section>

        <div className={SHELL}>
          {CASE_STUDIES.map((study, index) => (
            <article key={study.slug} id={study.slug} className="section-space grid gap-7 border-b border-black/10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-[7vw]">
              <div>
                <p className="eyebrow text-brand">Кейс {String(index + 1).padStart(2, "0")} · {study.instrument}</p>
                <h2 className="mt-4 max-w-[25ch] text-[clamp(1.625rem,2.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
                  {study.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">{study.sector}</p>
              </div>
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-semibold">Задача</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{study.task}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold">Сложность</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{study.challenge}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold">Что сделал Кока</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{study.solution}</dd>
                </div>
                <div className="rounded-xl border border-brand/10 bg-brand-soft/65 p-5 sm:p-6">
                  <dt className="eyebrow text-brand">Результат</dt>
                  <dd className="mt-2 text-sm font-medium leading-relaxed text-brand-dark sm:text-base">{study.result}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <section className={`${SHELL} section-space`}>
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-ink p-7 text-paper md:flex-row md:items-center md:gap-10 md:p-10">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">У вас похожая задача?</h2>
              <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-white/70">Разберём ситуацию и оценим, какие варианты финансирования можно рассмотреть.</p>
            </div>
            <Link href="/#lead" className="button-primary shrink-0">
              Обсудить задачу <SiteIcon name="arrow" className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
