import { SERVICES } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">
          Услуги
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Полный спектр финансовых <span className="text-brand">инструментов</span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          Под задачу бизнеса любого масштаба — от пополнения оборотки до проектного
          финансирования на миллиарды.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
            <div className="group flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <h4 className="text-lg font-semibold tracking-tight">{s.title}</h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <a
                href="#lead"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand transition-colors group-hover:text-brand-dark"
              >
                Оставить заявку
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
