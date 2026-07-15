import Reveal from "@/components/site/Reveal";
import AdvantageIcon, { type AdvantageIconName } from "@/components/site/AdvantageIcon";
import CardChevrons from "@/components/site/CardChevrons";

const POINTS: { title: string; bank: string; us: string; icon: AdvantageIconName }[] = [
  {
    title: "Десятки банков вместо одного",
    bank: "Банк предложит только свои продукты и ставки.",
    us: "Подаём заявку в 40+ банков и выбираем лучшие условия из всех.",
    icon: "banks",
  },
  {
    title: "На вашей стороне",
    bank: "Менеджер банка защищает интересы банка.",
    us: "Мы представляем интересы заёмщика — по доверенности, юридически.",
    icon: "shield",
  },
  {
    title: "Оплата за результат",
    bank: "Отказ — и вы потеряли время.",
    us: "Комиссию платите только когда получили финансирование.",
    icon: "result",
  },
];

export default function WhyBroker() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand">Почему мы</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Почему независимый брокер <span className="text-brand">выгоднее</span>
        </h2>
        <p className="mt-4 text-lg text-muted">
          Мы не привязаны к одному банку и не продаём чужие продукты. Работаем на результат
          заёмщика.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {POINTS.map((p, i) => (
          <Reveal key={i} delay={i * 0.06} className="h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-brand-dark p-6 shadow-[var(--shadow-soft)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
              <CardChevrons />
              <div className="relative flex h-full flex-col">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                  <AdvantageIcon name={p.icon} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-white">{p.title}</h3>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex gap-3 rounded-xl bg-white/[0.06] p-3 text-white/70">
                    <span className="text-red-300">✕</span>
                    <span>
                      <b className="text-white/75">Банк напрямую:</b> {p.bank}
                    </span>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-brand/35 p-3 text-white/85">
                    <span className="text-gold-bright">✓</span>
                    <span>
                      <b className="text-white">Через нас:</b> {p.us}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
