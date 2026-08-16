import { SERVICES } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import Reveal from "@/components/site/Reveal";

export default function Services() {
  return (
    <section id="services" className={`${SHELL} py-20 md:py-28`}>
      <Reveal className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Подбираем инструмент <span className="text-brand">под вашу задачу</span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          Кредит, гарантия, факторинг, лизинг или проектное финансирование — от пополнения
          оборотки до сделок на миллиарды.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => {
          const badge =
            s.slug === "credit"
              ? {
                  text: "Ключевой продукт",
                  ring: "border-gold/40 ring-1 ring-gold/30",
                  pill: "bg-gold/15 text-gold",
                }
              : s.slug === "mortgage"
                ? {
                    text: "Большой спрос",
                    ring: "border-brand/40 ring-1 ring-brand/30",
                    pill: "bg-brand-soft text-brand-dark",
                  }
                : s.slug === "project"
                  ? {
                      text: "Опережая рынок",
                      ring: "border-ink/25 ring-1 ring-ink/15",
                      pill: "bg-ink text-white",
                    }
                  : null;
          return (
          <Reveal key={s.slug} delay={(i % 3) * 0.06} className="h-full">
            <div
              className={`group relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${
                badge ? badge.ring : "border-black/[0.07]"
              }`}
            >
              {badge && (
                <span
                  className={`mb-3 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badge.pill}`}
                >
                  {badge.text}
                </span>
              )}
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                {s.segment}
              </p>
              <h3 className="text-lg font-semibold tracking-tight">{s.title}</h3>
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
          );
        })}
      </div>
    </section>
  );
}
