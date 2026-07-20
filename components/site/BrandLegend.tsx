import Reveal from "@/components/site/Reveal";

// Позиции искр (в % от секции). Разброс и длительности заданы вручную, а не случайно:
// Math.random в сборке недоступен, да и стабильная раскладка предсказуемее.
const SPARKS = [
  { top: "18%", left: "12%", delay: "0s", dur: "2.4s" },
  { top: "62%", left: "8%", delay: "0.8s", dur: "3.1s" },
  { top: "30%", left: "88%", delay: "0.4s", dur: "2.7s" },
  { top: "74%", left: "82%", delay: "1.2s", dur: "2.9s" },
  { top: "48%", left: "94%", delay: "0.6s", dur: "3.3s" },
  { top: "12%", left: "68%", delay: "1.6s", dur: "2.5s" },
];

export default function BrandLegend() {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-paper">
      {/* Искры — тонкий мотив «горячего металла». motion-reduce:animate-none уважает
          системную настройку «уменьшить движение». Жёлтый на тёмном — по бренд-гайду
          (на белом жёлтый знак запрещён). */}
      {SPARKS.map((s, i) => (
        <span
          key={i}
          aria-hidden
          className="pointer-events-none absolute h-1.5 w-1.5 rotate-45 rounded-[1px] bg-gold-bright/70 motion-safe:animate-ping motion-reduce:opacity-40"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}

      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-bright">
            Почему KOVI
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            Куём <span className="text-gold-bright">капитал</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-white/70">
            <b className="font-semibold text-white">Ков-</b>, древний славянский корень: ковать,
            чеканить. В сербском <i>kovati novac</i> — «чеканить деньги», а <i>kovnica</i> —
            монетный двор. В финском <i>kova</i> — «твёрдый», как в выражении «твёрдая валюта».
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Мы выбрали это имя не случайно: KOVI{" "}
            <span className="text-gold-bright">выковывает финансовые решения</span> для вашего
            бизнеса — соединяет вас с банком и доводит сделку до результата.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
