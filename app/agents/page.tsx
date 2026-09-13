import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Agents from "@/components/site/Agents";
import SiteIcon from "@/components/site/SiteIcon";
import { CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Агентам и партнёрам",
  description: "Партнёрская программа KOVI Finance: передавайте клиентов, которым нужно финансирование, и получайте долю вознаграждения после закрытия сделки.",
  alternates: { canonical: "/agents" },
};

export default function AgentsPage() {
  return <><Header /><main className="flex-1">
    <section className="bg-ink text-paper"><div className={`${SHELL} section-space`}>
      <Link href="/" className="mb-8 inline-flex min-h-10 items-center text-sm text-white/60 hover:text-white">← На главную</Link>
      <p className="eyebrow mb-5 text-[#d9bd75]">Партнёрская программа</p>
      <h1 className="max-w-[20ch] text-[clamp(2.25rem,4.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]">Ваши клиенты. Наша экспертиза.</h1>
      <p className="mt-6 max-w-[55ch] text-base leading-relaxed text-white/70 sm:text-lg">Передавайте клиентов, которым нужно банковское финансирование. Мы берём на себя работу по сделке, а вы получаете долю нашего вознаграждения.</p>
      <a href={CONTACTS.phoneHref} className="button-primary mt-7">Обсудить сотрудничество <SiteIcon name="arrow" className="size-4" /></a>
    </div></section>
    <Agents />
    <section className={`${SHELL} section-space border-t border-black/10`}>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-16"><h2 className="section-heading max-w-[20ch]">Сначала договоримся об условиях</h2><div><p className="max-w-[52ch] text-base leading-relaxed text-muted">Обсудим задачу клиента, порядок взаимодействия и вашу долю вознаграждения. Выплата — после закрытия сделки и получения нашей комиссии.</p><a href={CONTACTS.phoneHref} className="text-link mt-5">{CONTACTS.phone}</a><a href={CONTACTS.emailHref} className="ml-5 text-link">{CONTACTS.email}</a></div></div>
    </section>
  </main><Footer /></>;
}
