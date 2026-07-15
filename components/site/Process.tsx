import { PROCESS } from "@/lib/site";
import Reveal from "@/components/site/Reveal";
import AdvantageIcon, { type AdvantageIconName } from "@/components/site/AdvantageIcon";

const ADVANTAGES: { title: string; desc: string; icon: AdvantageIconName }[] = [
  {
    title: "Оплата за результат",
    desc: "Комиссия — только после того, как вы получили деньги.",
    icon: "result",
  },
  {
    title: "40+ банков",
    desc: "Подаём в несколько банков сразу и выбираем лучшие условия.",
    icon: "banks",
  },
  { title: "Сложные кейсы", desc: "Берёмся там, где банки отказывают напрямую.", icon: "cases" },
  {
    title: "Личный менеджер",
    desc: "Один человек ведёт вашу сделку от заявки до денег.",
    icon: "manager",
  },
];

export default function Process() {
  return (
    <section id="process" className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-2">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">
            Как работаем
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-5xl">
            Четыре шага до <span className="text-brand">финансирования</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Берём на себя переговоры с банком. Вы занимаетесь в это время своим бизнесом.
          </p>

          <ol className="mt-10 space-y-6">
            {PROCESS.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-sm font-bold text-brand-dark">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2">
          {ADVANTAGES.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="h-full">
            <div
              className="group h-full rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-ink">
                <AdvantageIcon name={a.icon} />
              </div>
              <h3 className="font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.desc}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
