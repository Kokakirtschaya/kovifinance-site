import Image from "next/image";
import { SHELL } from "@/lib/layout";
import Reveal from "@/components/site/Reveal";

const FEATURES = [
  {
    title: "Сделки и банки",
    desc: "Одна карточка — несколько банков, стадия и кто сейчас отвечает: мы, клиент или банк.",
  },
  {
    title: "Почта и календарь",
    desc: "Переписка по компании и встречи в одном окне. Письмо не теряется в чужом ящике.",
  },
  {
    title: "Досье клиента",
    desc: "Устав, отчётность, договоры и анкеты банков лежат на карточке, а не в чатах.",
  },
];

export default function CrmTeaser() {
  return (
    <section id="crm" className="bg-paper">
      <div className={`${SHELL} py-20 md:py-28`}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-dark">
                В разработке
              </span>
              <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                Запуск — IV квартал 2026
              </span>
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.02em] md:text-5xl">
              KOVI CRM. Сделка{" "}
              <span className="text-brand">на одном экране</span>
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Мы собираем свою систему под брокерскую работу: не общая «воронка», а место,
              где живут заявка, банк, письмо, досье и следующий шаг. Сейчас CRM уже ведёт
              наши сделки внутри. К концу 2026 откроем её клиентам и агентам — спокойно,
              без спешки и без чужого софта.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-brand-dark shadow-[var(--shadow-lift)]">
              <Image
                src="/crm/desk.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-soft md:aspect-auto md:min-h-[280px] md:h-full">
              <Image
                src="/crm/folders.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full flex-col rounded-3xl bg-brand-dark p-8 text-white shadow-[var(--shadow-soft)] md:p-10">
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-bright">
                IV квартал 2026
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">
                Сначала доводим до тишины. Потом открываем.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Почта, календарь, досье и расчёт резерва по 590-П уже в работе у команды.
                Публичный доступ появится, когда система будет вести сделку так же
                спокойно, как мы ведём её руками.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
