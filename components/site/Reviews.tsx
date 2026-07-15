import { REVIEWS } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      <Reveal className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Что говорят <span className="text-brand">клиенты</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <Reveal key={i} delay={i * 0.06} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)]">
              <div className="text-4xl leading-none text-brand/25">“</div>
              <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink">
                {r.text}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-black/5 pt-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand-dark">
                  {r.name.slice(0, 1)}
                </span>
                <span>
                  <span className="block text-sm font-semibold tracking-tight">{r.name}</span>
                  <span className="block text-xs text-muted">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
