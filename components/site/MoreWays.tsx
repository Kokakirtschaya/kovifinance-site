import Link from "next/link";
import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function MoreWays() {
  return (
    <div className="border-b border-black/[0.08] bg-paper-2/60">
      <div className={`${SHELL} grid gap-6 py-10 md:grid-cols-2 md:gap-12 md:py-12`}>
        <section id="agents" className="flex items-start gap-4 md:border-r md:border-black/10 md:pr-10">
          <SiteIcon name="manager" className="mt-1 size-6 shrink-0 text-brand" />
          <div><h2 className="text-xl font-semibold tracking-tight">Агентам и партнёрам</h2><p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">Приводите клиентов и получайте долю нашего вознаграждения за закрытую сделку.</p><Link href="/agents" className="text-link mt-2">Условия сотрудничества <SiteIcon name="arrow" className="size-4" /></Link></div>
        </section>
        <section id="crm" className="flex items-start gap-4">
          <SiteIcon name="crm" className="mt-1 size-6 shrink-0 text-brand" />
          <div><h2 className="text-xl font-semibold tracking-tight">KOVI CRM</h2><p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">Сделка, документы и следующий шаг в одном месте. Готовим доступ для клиентов и агентов.</p><Link href="/crm" className="text-link mt-2">О системе <SiteIcon name="arrow" className="size-4" /></Link></div>
        </section>
      </div>
    </div>
  );
}
