import Image from "next/image";
import { SHELL } from "@/lib/layout";
import MagneticButton from "@/components/site/MagneticButton";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink text-paper">
      <div className="grain pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 100% 0%, rgba(30,122,87,0.30) 0%, transparent 70%), radial-gradient(55% 45% at 0% 100%, rgba(212,160,23,0.12) 0%, transparent 70%)",
        }}
      />

      <div
        className={`relative flex flex-col gap-10 py-12 md:py-16 lg:flex-row lg:items-center lg:gap-[4vw] lg:py-[min(6vw,5.5rem)] ${SHELL}`}
      >
        <div className="min-w-0 flex-1">
          <p className="rise mb-4 text-sm font-semibold text-gold-bright lg:text-base">
            Куём капитал
          </p>
          <h1
            className="rise max-w-[16ch] font-bold leading-[1.06] tracking-[-0.03em] text-[clamp(2.25rem,4.2vw,7.5rem)]"
            style={{ animationDelay: "0.07s" }}
          >
            Финансирование для бизнеса.{" "}
            <span className="text-gold-bright">Быстро</span> и без бюрократии
          </h1>
          <p
            className="rise mt-6 max-w-[44ch] leading-relaxed text-white/70 text-[clamp(1.05rem,1.25vw,1.4rem)]"
            style={{ animationDelay: "0.14s" }}
          >
            Подберём кредит, гарантию, факторинг или лизинг. Заявка 5 минут,
            решение от 3 дней. Оплата за результат.
          </p>
          <div
            className="rise mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.21s" }}
          >
            <MagneticButton
              href="#lead"
              className="rounded-full bg-brand px-7 py-3.5 text-center font-semibold text-white shadow-[0_8px_24px_rgba(30,122,87,0.35)] hover:bg-brand-dark"
            >
              Оставить заявку
            </MagneticButton>
            <MagneticButton
              href="#calc"
              className="rounded-full border border-white/20 px-7 py-3.5 text-center font-semibold text-white hover:bg-white/10"
            >
              Рассчитать условия
            </MagneticButton>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm shrink-0 lg:mx-0 lg:max-w-none lg:w-[38%] xl:w-[34%]">
          <div
            className="rise relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            style={{ animationDelay: "0.12s" }}
          >
            <Image
              src="/brand/hero-owner.jpg"
              alt="Эксперт по финансированию KOVI Finance"
              fill
              sizes="(min-width: 1024px) 36vw, 90vw"
              priority
              className="object-cover object-[center_28%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
