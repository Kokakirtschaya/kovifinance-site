import type { ReactNode } from "react";
import type { Step } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import SiteIcon, { type SiteIconName } from "@/components/site/SiteIcon";

export type Advantage = { title: string; desc: string; icon: SiteIconName };

export default function StepsSection({ id, title, subtitle, steps, advantages, className = "" }: {
  id: string; title: ReactNode; subtitle: string; steps: Step[]; advantages: Advantage[]; className?: string;
}) {
  return (
    <section id={id} className={className}>
      <div className={`${SHELL} section-space`}>
        <div className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <h2 className="section-heading max-w-[23ch]">{title}</h2>
          <p className="max-w-[52ch] text-base leading-relaxed text-muted">{subtitle}</p>
        </div>
        <ol className={`mt-9 grid gap-7 sm:grid-cols-2 lg:mt-12 ${steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-2"}`}>
          {steps.map(s => (
            <li key={s.n} className="border-t border-brand/25 pt-5">
              <span className="text-sm font-medium tabular-nums text-brand">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className={`mt-10 grid gap-6 rounded-2xl bg-brand-soft/55 p-6 sm:grid-cols-2 lg:mt-12 lg:p-8 ${advantages.length === 4 ? "xl:grid-cols-4" : ""}`}>
          {advantages.map(a => (
            <div key={a.title} className="flex items-start gap-3">
              <SiteIcon name={a.icon} className="mt-0.5 size-5 shrink-0 text-brand" />
              <div><h3 className="text-sm font-semibold">{a.title}</h3><p className="mt-1.5 text-sm leading-relaxed text-muted">{a.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
