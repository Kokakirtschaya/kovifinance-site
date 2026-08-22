import Image from "next/image";
import { SHELL } from "@/lib/layout";

const FEATURES = [
  {
    title: "Сделки и банки",
    desc: "Одна карточка: несколько банков, стадия и кто сейчас отвечает.",
  },
  {
    title: "Почта и календарь",
    desc: "Переписка по компании и встречи в одном окне.",
  },
  {
    title: "Досье клиента",
    desc: "Устав, отчётность, договоры и анкеты банков на карточке, не в чатах.",
  },
];

export default function CrmTeaser() {
  return (
    <section id="crm" className="bg-paper">
      <div className={`${SHELL} py-20 md:py-28`}>
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-sm text-muted">В разработке. Откроем в IV квартале 2026.</p>
            <h2 className="mt-4 max-w-[14ch] text-3xl font-bold tracking-[-0.03em] md:text-5xl">
              KOVI CRM. Сделка <span className="text-brand">на одном экране</span>
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">
              Система под брокерскую работу: заявка, банк, письмо, досье и следующий
              шаг. Сейчас ведёт наши сделки внутри. К концу 2026 откроем клиентам
              и агентам.
            </p>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-brand-dark">
            <Image
              src="/crm/desk.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <ul className="mt-14 grid gap-8 border-t border-black/[0.08] pt-10 md:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title}>
              <h3 className="font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-muted">{f.desc}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[240px] overflow-hidden rounded-3xl bg-brand-soft">
            <Image
              src="/crm/folders.jpg"
              alt=""
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center rounded-3xl bg-ink p-8 text-white md:p-10">
            <h3 className="text-2xl font-bold tracking-tight">
              Сначала доводим до тишины. Потом открываем.
            </h3>
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-white/70">
              Почта, календарь, досье и расчёт резерва по 590-П уже в работе у
              команды. Публичный доступ появится, когда система будет вести сделку
              так же спокойно, как мы ведём её руками.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
