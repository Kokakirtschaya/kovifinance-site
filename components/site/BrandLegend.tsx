import Image from "next/image";
import Reveal from "@/components/site/Reveal";

export default function BrandLegend() {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-paper">
      <Image
        src="/mood/services/mortgage.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/75 to-brand-dark/90" />

      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-white md:text-5xl">
            Куём <span className="text-gold-bright">капитал</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/70">
            <b className="font-semibold text-white">Ков-</b>, древний славянский корень: ковать,
            чеканить. В сербском <i>kovati novac</i> значит «чеканить деньги», а <i>kovnica</i>:
            монетный двор. В финском <i>kova</i> значит «твёрдый», как в выражении «твёрдая валюта».
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Мы выбрали это имя не случайно: KOVI{" "}
            <span className="text-gold-bright">выковывает финансовые решения</span> для вашего
            бизнеса: соединяет вас с банком и доводит сделку до результата.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
