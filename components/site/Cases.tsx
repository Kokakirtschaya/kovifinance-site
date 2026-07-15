import { CASES } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Cases() {
  return (
    <section id="cases" className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-bright">
            Результаты
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-5xl">
            Кейсы, где мы получили <span className="text-gold-bright">«да»</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Реальные задачи бизнеса, которые закрыли за дни, а не месяцы — часто там, где банки
            отказывали напрямую.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CASES.map((c, i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.07]">
                <span className="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
                  {c.tag}
                </span>
                <p className="mt-5 text-3xl font-semibold tracking-tight text-gold-bright">
                  {c.metric}
                </p>
                <h3 className="mt-2 font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-xs text-white/40">
          Показаны типовые примеры сделок. Конкретные условия зависят от вашей ситуации.
        </p>
      </div>
    </section>
  );
}
