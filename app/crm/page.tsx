import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import SiteIcon from "@/components/site/SiteIcon";
import { CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "KOVI CRM — система сопровождения сделок",
  description: "KOVI CRM объединяет сделки, документы, переписку и следующие шаги. Система используется внутри KOVI Finance; доступ для клиентов и агентов готовится.",
  alternates: { canonical: "/crm" },
};

const features = [
  { icon: "credit", title: "Сделки и банки", text: "Заявка, предложения банков и текущий этап собраны в одной карточке." },
  { icon: "cases", title: "Документы по сделке", text: "Отчётность, договоры и анкеты связаны с компанией и её задачей." },
  { icon: "manager", title: "Переписка и встречи", text: "Договорённости и следующий шаг остаются рядом со сделкой." },
];

export default function CrmPage() {
  return <><Header /><main className="flex-1">
    <section className="bg-ink text-paper"><div className={`${SHELL} section-space`}>
      <Link href="/" className="mb-8 inline-flex min-h-10 items-center text-sm text-white/60 hover:text-white">← На главную</Link>
      <p className="eyebrow mb-5 text-[#d9bd75]">KOVI CRM · В разработке</p>
      <h1 className="max-w-[18ch] text-[clamp(2.25rem,4.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]">Сделка на одном экране</h1>
      <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-white/70 sm:text-lg">Заявка, банк, документы и следующий шаг. Мы уже используем систему внутри KOVI Finance и готовим доступ для клиентов и агентов.</p>
      <p className="mt-6 text-sm text-white/60">Планируем открыть доступ в IV квартале 2026 года.</p>
    </div></section>
    <section className={`${SHELL} section-space`}>
      <h2 className="section-heading max-w-[24ch]">Всё, что помогает двигать сделку вперёд</h2>
      <div className="mt-9 grid gap-4 md:grid-cols-3">{features.map(f => <article key={f.title} className="rounded-2xl border border-black/10 bg-white p-6 md:p-8"><SiteIcon name={f.icon} className="size-7 text-brand" /><h3 className="mt-6 text-xl font-semibold tracking-tight">{f.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{f.text}</p></article>)}</div>
    </section>
    <section className="border-t border-black/10 bg-paper-2/60"><div className={`${SHELL} section-space grid gap-6 lg:grid-cols-2 lg:gap-16`}><h2 className="section-heading max-w-[20ch]">О запуске и доступе</h2><div><p className="max-w-[52ch] text-base leading-relaxed text-muted">Пока система работает внутри команды. Если хотите обсудить будущий доступ, свяжитесь с нами — расскажем, что готовим для клиентов и партнёров.</p><a href={CONTACTS.emailHref} className="text-link mt-5">{CONTACTS.email} <SiteIcon name="arrow" className="size-4" /></a></div></div></section>
  </main><Footer /></>;
}
