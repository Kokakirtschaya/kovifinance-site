import Image from "next/image";
import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-ink text-paper">
      <div className={`${SHELL} grid gap-9 py-10 sm:py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-[7vw] lg:py-16`}>
        <div>
          <p className="eyebrow mb-6 flex items-center gap-3 text-white/65">
            <span className="h-px w-7 shrink-0 bg-gold" aria-hidden />
            Независимый финансовый советник
          </p>
          <h1 className="max-w-[17ch] text-[clamp(2.1rem,4.5vw,5.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
            Финансирование <span className="block">под задачи</span>{" "}<span className="block text-[#bbd7c8]">вашего бизнеса</span>
          </h1>
          <p className="mt-6 max-w-[43ch] text-base leading-relaxed text-white/70 sm:text-lg">
            Кредиты, гарантии и другие банковские инструменты. Подбираем банк и ведём сделку до получения денег.
          </p>
          <div id="hero-actions" className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#lead" className="button-primary">Обсудить задачу <SiteIcon name="arrow" className="size-4" /></a>
            <a href="#calc" className="inline-flex min-h-12 items-center justify-center gap-2 px-3 text-sm font-medium text-white/85 hover:text-white">
              Рассчитать условия <SiteIcon name="arrow" className="size-4" />
            </a>
          </div>
          <p className="mt-5 max-w-[44ch] text-xs leading-relaxed text-white/55 sm:text-sm">
            Без предоплаты. Вознаграждение — после получения финансирования.
          </p>
        </div>
        <figure className="flex items-center gap-4 border-t border-white/15 pt-6 lg:block lg:border-0 lg:pt-0">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-brand-dark sm:size-28 lg:aspect-[4/5] lg:h-auto lg:w-full lg:rounded-2xl">
            <Image src="/brand/hero-owner.jpg" alt="Кока Кирцхая, основатель KOVI Finance" fill sizes="(min-width: 1024px) 35vw, 112px" priority className="object-cover object-[center_20%]" />
          </div>
          <figcaption className="lg:mt-5 lg:flex lg:items-start lg:justify-between lg:gap-4">
            <div>
              <p className="text-base font-medium text-white">Кока Кирцхая</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60 sm:text-sm">Основатель KOVI Finance</p>
            </div>
            <p className="mt-2 text-xs text-[#d9bd75] sm:text-sm lg:mt-0 lg:max-w-36 lg:text-right">15+ лет в банковском секторе</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
