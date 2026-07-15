import { TRUST_MARQUEE } from "@/lib/site";

export default function TrustBar() {
  const items = [...TRUST_MARQUEE, ...TRUST_MARQUEE];

  return (
    <section className="border-b border-black/5 bg-paper py-10">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <p className="text-lg font-semibold text-ink">Мы независимый брокер.</p>
        <p className="mt-2 text-base leading-relaxed text-muted">
          Представляем интересы заёмщика по доверенности и подаём заявку в банк — выбираем
          лучшие условия <span className="text-brand">для вас, а не для банка</span>.
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-3 pr-3">
          {items.map((item, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border border-black/10 bg-white px-5 py-2 text-sm font-medium text-ink/70"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
