import Image from "next/image";
import { SHELL } from "@/lib/layout";
import Reveal from "@/components/site/Reveal";

// Честный блок: один эксперт-основатель, без выдуманных сотрудников.
// Реальные регалии работают сами — прямой контакт с экспертом это преимущество,
// а не слабость.
const POINTS = [
  "Знает требования банков изнутри: получает одобрения там, где отказывают другим",
  "Вы работаете напрямую с экспертом, а не с колл-центром или младшим менеджером",
  "Лично ведёт сделку от первой заявки до получения денег",
];

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-20 md:py-28">
      {/* Фон-офис под тёмной вуалью — читаемость держит матовое стекло карточки. */}
      <Image src="/team/office.jpg" alt="" aria-hidden fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/70 to-ink/40" />

      <div className={`relative ${SHELL}`}>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            Вы работаете напрямую <span className="text-gold-bright">с основателем</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Никаких младших менеджеров и колл-центров: сделку от первой заявки
            до получения денег ведёт основатель компании.
          </p>
        </Reveal>

        {/* Карточку НЕ оборачиваем в Reveal: пока у предка анимируется opacity,
            браузер изолирует его в отдельный слой и backdrop-filter не работает —
            стекло секунду стоит прозрачным, а размывается только после анимации.
            Матовое стекло (backdrop-blur) убрано вместе с остальными фильтрами —
            вместо него непрозрачная подложка ink: офис за карточкой не просвечивает. */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/15 bg-ink shadow-[var(--shadow-lift)] md:flex">
          {/* Портрет всегда 3:4 и фиксированной ширины: не растягивается
              в ленту на ультраwide и не зумится в ухо на узком окне. */}
          <div className="relative mx-auto mt-6 aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-2xl bg-brand-dark sm:w-52 md:mx-0 md:mt-0 md:w-[20rem] md:rounded-none lg:w-[22rem]">
            <Image
              src="/brand/founder.jpg"
              alt="Кирцхая Кока, основатель KOVI Finance"
              fill
              sizes="(min-width: 768px) 22rem, 13rem"
              className="object-cover object-[50%_12%]"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center px-6 pb-8 pt-5 sm:px-8 md:p-10">
            <h3 className="text-2xl font-bold text-white">Кирцхая Кока</h3>
            <p className="mt-1 font-medium text-gold-bright">
              Основатель KOVI Finance · 15+ лет в банковском секторе
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3">
                  <span className="mt-0.5 shrink-0 text-gold-bright">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <a
              href="#lead"
              className="press mt-8 inline-block self-start rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Обсудить задачу лично
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
