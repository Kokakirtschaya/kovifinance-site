import { CASES } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Cases() {
  return (
    <section id="cases" className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
            Кейсы, где мы получили <span className="text-gold-bright">«да»</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Реальные задачи бизнеса, которые закрыли за дни, а не месяцы — часто там, где банки
            отказывали напрямую.
          </p>
        </Reveal>

        <div className="mt-12 space-y-5">
          {/* Флагманский кейс — на всю ширину */}
          <Reveal>
            <div className="flex flex-col gap-6 rounded-3xl border border-gold-bright/20 bg-white/[0.06] p-7 transition-colors hover:bg-white/[0.08] md:flex-row md:items-center md:gap-10 md:p-10">
              <div className="md:shrink-0">
                <span className="inline-block rounded-full bg-gold-bright/15 px-3 py-1 text-xs font-medium text-gold-bright">
                  {CASES[0].tag}
                </span>
                <p className="mt-4 text-5xl font-semibold tracking-tight text-gold-bright md:text-6xl">
                  {CASES[0].metric}
                </p>
              </div>
              <div className="md:border-l md:border-white/10 md:pl-10">
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                  {CASES[0].title}
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-white/60">{CASES[0].desc}</p>
              </div>
            </div>
          </Reveal>

          {/* Остальные кейсы */}
          <div className="grid gap-5 md:grid-cols-3">
            {CASES.slice(1).map((c, i) => (
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
        </div>

        <p className="mt-8 text-xs text-white/40">
          Показаны типовые примеры сделок. Конкретные условия зависят от вашей ситуации.
        </p>
      </div>
    </section>
  );
}
