import type { ReactNode } from "react";
import type { Step } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import Reveal from "@/components/site/Reveal";
import AdvantageIcon, { type AdvantageIconName } from "@/components/site/AdvantageIcon";
import CardChevrons from "@/components/site/CardChevrons";

/** decor.box — доля от карточки, а не пиксели: карточка резиновая, и жёсткий размер
    на узком экране заполнял её целиком. Потолок по высоте не даёт картинке вылезти
    за карточку, object-contain держит пропорции файла. */
export type Advantage = {
  title: string;
  desc: string;
  icon: AdvantageIconName;
  decor?: { src: string; box: string };
};

/** Общая разметка для блоков «Клиентам» и «Агентам»: слева шаги, справа карточки.
    Тексты приходят пропсами — правятся в данных, а не в вёрстке. */
export default function StepsSection({
  id,
  title,
  subtitle,
  steps,
  advantages,
  className = "",
}: {
  id: string;
  title: ReactNode;
  subtitle: string;
  steps: Step[];
  advantages: Advantage[];
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className={`${SHELL} py-20 md:py-28`}>
        <div className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">{title}</h2>
            <p className="mt-4 text-lg text-muted">{subtitle}</p>

            <ol className="mt-10">
              {steps.map((s, i) => {
                const last = i === steps.length - 1;
                return (
                  <li key={s.n} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5">
                    {!last && (
                      <span
                        aria-hidden
                        className="absolute left-[21px] top-12 bottom-0 w-0.5 rounded-full bg-gradient-to-b from-brand/50 to-gold/40"
                      />
                    )}
                    <span
                      className={`relative z-[1] grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-bold tabular-nums shadow-[0_6px_16px_rgba(30,122,87,0.16)] ${
                        last
                          ? "bg-brand text-white"
                          : "bg-brand-soft text-brand-dark ring-1 ring-brand/20"
                      }`}
                    >
                      {s.n}
                    </span>
                    <div className="min-w-0 pt-1.5">
                      <h3 className="font-semibold tracking-tight">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {advantages.map((a, i) => (
              <Reveal key={a.title} delay={i * 0.06} className="h-full">
                <div className="group relative h-full min-h-[280px] overflow-hidden rounded-2xl bg-brand-dark p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                  {a.decor ? (
                    /* Анимация живёт внутри SVG, поэтому грузим картинкой — так её CSS не утечёт
                       на страницу. next/image не подходит: SVG он не оптимизирует без
                       dangerouslyAllowSVG. */
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.decor.src}
                      alt=""
                      aria-hidden
                      className={`pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 object-contain opacity-70 ${a.decor.box}`}
                    />
                  ) : (
                    <CardChevrons />
                  )}
                  <div className="relative">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                      <AdvantageIcon name={a.icon} />
                    </div>
                    <h3 className="font-semibold tracking-tight text-white">{a.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{a.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
