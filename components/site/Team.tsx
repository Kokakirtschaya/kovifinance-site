import Image from "next/image";
import Reveal from "@/components/site/Reveal";

// Честный блок: один эксперт-основатель, без выдуманных сотрудников.
// Реальные регалии работают сами — прямой контакт с экспертом это преимущество,
// а не слабость.
const POINTS = [
  "Знаю требования банков изнутри — получаю одобрения там, где отказывают другим",
  "Вы работаете напрямую с экспертом, а не с колл-центром или младшим менеджером",
  "Лично веду сделку от первой заявки до получения денег",
];

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-20 md:py-28">
      {/* Фон-офис под тёмной вуалью — читаемость держит матовое стекло карточки. */}
      <Image src="/team/office.png" alt="" aria-hidden fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/70 to-ink/40" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            Вы работаете напрямую <span className="text-gold-bright">с основателем</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Никаких младших менеджеров и колл-центров — вашу сделку от первой заявки
            до получения денег веду я лично.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="grid overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] shadow-[var(--shadow-lift)] backdrop-blur-md md:grid-cols-[0.85fr_1.15fr]">
            {/* Портрет основателя. Портретная пропорция колонки (4:5) под пропорции
                самого фото — иначе object-cover «зумит» лицо в почти-квадрат. */}
            <div className="relative aspect-[4/5] bg-brand-dark">
              <Image
                src="/brand/founder.png"
                alt="Кирцхая Кока — основатель KOVI Finance"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10">
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
        </Reveal>
      </div>
    </section>
  );
}
