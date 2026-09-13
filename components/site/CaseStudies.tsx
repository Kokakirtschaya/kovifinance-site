import Link from "next/link";
import { CASE_STUDIES } from "@/lib/cases";
import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function CaseStudies() {
  return (
    <section id="cases" className={`${SHELL} pb-14 md:pb-20`}>
      <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end md:gap-10">
        <div>
          <p className="eyebrow mb-4 text-brand">Из практики Коки Кирцхая</p>
          <h2 className="section-heading max-w-[25ch]">Как решались задачи клиентов</h2>
        </div>
        <Link href="/cases" className="text-link shrink-0">
          Больше кейсов <SiteIcon name="arrow" className="size-4" />
        </Link>
      </div>

      <div className="mt-7 grid gap-4 lg:mt-9 lg:grid-cols-3">
        {CASE_STUDIES.filter(study => study.featured).map(study => (
          <article key={study.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div className="flex flex-1 flex-col p-6 lg:p-7">
              <p className="text-xs leading-relaxed text-muted">{study.sector}</p>
              <h3 className="mt-3 text-xl font-semibold leading-[1.2] tracking-tight lg:text-2xl">
                {study.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{study.summary}</p>
              <Link href={`/cases#${study.slug}`} className="text-link mt-auto pt-5" aria-label={`Подробнее: ${study.title}`}>
                Как устроили сделку <SiteIcon name="arrow" className="size-4" />
              </Link>
            </div>
            <div className="border-t border-brand/10 bg-brand-soft/55 px-6 py-5 lg:px-7">
              <p className="eyebrow text-brand">Результат</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-brand-dark">{study.outcome}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
