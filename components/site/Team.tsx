import { TEAM } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Team() {
  return (
    <section id="team" className="bg-paper-2/60 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
            С вами работают <span className="text-brand">практики рынка</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Бывшие банкиры и финансовые аналитики. Знаем требования банков изнутри —
            поэтому получаем одобрения там, где отказывают другим.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
            <div
              className="h-full rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-xl font-semibold text-white">
                {m.name.slice(0, 1)}
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{m.name}</h3>
              <p className="mt-1 text-sm text-brand-dark">{m.role}</p>
              <p className="mt-3 text-sm text-muted">{m.note}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
