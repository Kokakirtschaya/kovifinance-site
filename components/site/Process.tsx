import { PROCESS } from "@/lib/site";
import Reveal from "@/components/site/Reveal";
import AdvantageIcon, { type AdvantageIconName } from "@/components/site/AdvantageIcon";
import CardChevrons from "@/components/site/CardChevrons";

/** decor.box — доля от карточки, а не пиксели: карточка резиновая, и жёсткий размер
    на узком экране заполнял её целиком и наезжал на текст. Потолок по высоте не даёт
    картинке вылезти за карточку, object-contain держит пропорции файла. */
const ADVANTAGES: {
  title: string;
  desc: string;
  icon: AdvantageIconName;
  decor?: { src: string; box: string };
}[] = [
  {
    title: "Оплата за результат",
    desc: "Комиссия — только после того, как вы получили деньги.",
    icon: "result",
    decor: { src: "/decor/cash-register.svg", box: "w-[60%] max-h-[78%]" },
  },
  {
    title: "40+ банков",
    desc: "Подаём в несколько банков сразу и выбираем лучшие условия.",
    icon: "banks",
    decor: { src: "/decor/banks.svg", box: "w-[88%] max-h-[78%]" },
  },
  {
    title: "Сложные кейсы",
    desc: "Берёмся там, где банки отказывают напрямую.",
    icon: "cases",
    decor: { src: "/decor/cases.svg", box: "w-[60%] max-h-[78%]" },
  },
  {
    title: "Личный менеджер",
    desc: "Один человек ведёт вашу сделку от заявки до денег.",
    icon: "manager",
    decor: { src: "/decor/manager.svg", box: "w-[60%] max-h-[78%]" },
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
              className="group relative h-full overflow-hidden rounded-2xl bg-brand-dark p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
            >
              {a.decor ? (
                /* Анимация живёт внутри SVG, поэтому грузим картинкой — так её CSS не утечёт на страницу.
                   next/image здесь не подходит: SVG он не оптимизирует без dangerouslyAllowSVG. */
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
    </section>
  );
}
