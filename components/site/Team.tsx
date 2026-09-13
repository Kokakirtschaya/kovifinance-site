import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function Team() {
  return (
    <section id="team" className="border-y border-black/[0.08] bg-paper-2/65">
      <div className={`${SHELL} section-space grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[8vw]`}>
        <div>
          <p className="eyebrow mb-4 text-brand">Личная ответственность</p>
          <h2 className="section-heading max-w-[20ch]">Вашу сделку ведёт основатель</h2>
          <div className="mt-7 flex items-center gap-5">
            <span className="text-6xl font-medium tracking-[-0.06em] text-brand-dark">15<span className="text-4xl text-gold">+</span></span>
            <p className="max-w-36 text-sm leading-relaxed text-muted">лет опыта в банковском секторе</p>
          </div>
        </div>
        <div>
          <p className="text-xl font-medium tracking-tight">Кока Кирцхая</p>
          <p className="mt-1 text-sm text-muted">Основатель KOVI Finance</p>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted">Лично разбирает вашу задачу, выбирает банки и ведёт переговоры. Вы общаетесь с человеком, который отвечает за сделку от первого разговора до получения финансирования.</p>
          <ul className="mt-6 space-y-3 text-sm leading-relaxed">
            <li className="flex items-start gap-3"><SiteIcon name="result" className="mt-0.5 size-5 shrink-0 text-brand" />Знает требования банков изнутри</li>
            <li className="flex items-start gap-3"><SiteIcon name="result" className="mt-0.5 size-5 shrink-0 text-brand" />Разбирает сложные сделки и причины отказов</li>
            <li className="flex items-start gap-3"><SiteIcon name="result" className="mt-0.5 size-5 shrink-0 text-brand" />Сопровождает переговоры и согласование условий</li>
          </ul>
          <a href="#lead" className="text-link mt-5">Обсудить задачу лично <SiteIcon name="arrow" className="size-4" /></a>
        </div>
      </div>
    </section>
  );
}
