import { SERVICES } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function Services() {
  return (
    <section id="services" className={`${SHELL} section-space`}>
      <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div><p className="eyebrow mb-4 text-brand">Финансовые инструменты</p><h2 className="section-heading max-w-[23ch]">У каждой задачи — своё решение</h2></div>
        <p className="max-w-[48ch] text-base leading-relaxed text-muted lg:pb-1">От пополнения оборотных средств до инвестиционного проекта. Разберём вашу ситуацию и подберём подходящий инструмент.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 xl:grid-cols-4">
        {SERVICES.map((s, i) => (
          <article key={s.slug} className={`service-card flex min-w-0 flex-col rounded-2xl border p-6 hover:border-brand/35 lg:p-7 ${i < 2 ? "border-brand/15 bg-brand-soft/55 xl:col-span-2" : "border-black/[0.09] bg-white"}`}>
            <div className="flex items-center justify-between gap-4">
              <SiteIcon name={s.slug} className="size-7 text-brand" />
              <span className="text-xs tabular-nums text-muted/70">0{i + 1}</span>
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted">{s.segment}</p>
            <h3 className={`mt-2 font-semibold leading-[1.2] tracking-[-0.025em] ${i < 2 ? "text-2xl lg:text-[1.75rem]" : "text-xl"}`}>{s.title}</h3>
            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">{s.desc}</p>
            <div className="mt-auto pt-6">
              <div className="border-t border-brand/15 pt-5">
                <p className={`font-semibold tracking-tight text-brand-dark ${i < 2 ? "text-3xl" : "text-xl"}`}>{s.points[0]}</p>
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted">
                  {s.points.slice(1).map(p => <li key={p}>{p}</li>)}
                </ul>
              </div>
              <a href="#lead" className="text-link mt-4" aria-label={`Обсудить: ${s.title}`}>Обсудить условия <SiteIcon name="arrow" className="size-4" /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
