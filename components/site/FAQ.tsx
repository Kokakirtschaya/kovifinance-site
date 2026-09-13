import { FAQ as ITEMS, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export default function FAQ() {
  return (
    <section id="faq" className={`${SHELL} section-space grid gap-7 lg:grid-cols-[0.65fr_1.35fr] lg:gap-[8vw]`}>
      <div>
        <p className="eyebrow mb-4 text-brand">Перед первым разговором</p>
        <h2 className="section-heading">Частые вопросы</h2>
        <p className="mt-5 max-w-[30ch] text-sm leading-relaxed text-muted">О стоимости, сроках и том, как устроена работа.</p>
        <a href={CONTACTS.phoneHref} className="text-link mt-3">{CONTACTS.phone}</a>
      </div>
      <div className="border-t border-black/10">
        {ITEMS.map((item, i) => (
          <details key={item.q} name="site-faq" open={i === 0} className="faq-item border-b border-black/10">
            <summary className="flex min-h-16 cursor-pointer items-start justify-between gap-5 py-5 text-base font-medium tracking-tight">
              {item.q}<span aria-hidden className="faq-plus shrink-0 text-xl leading-6 text-brand transition-transform">+</span>
            </summary>
            <div className="max-w-[65ch] pb-6 pr-5 text-sm leading-relaxed text-muted"><FaqAnswer text={item.a} /></div>
          </details>
        ))}
      </div>
    </section>
  );
}

function FaqAnswer({ text }: { text: string }) {
  const needle = "Политике конфиденциальности";
  const i = text.indexOf(needle);
  if (i === -1) return text;
  return <>{text.slice(0, i)}<a href="/confidentiality" className="text-brand underline underline-offset-2 hover:text-brand-dark">{needle}</a>{text.slice(i + needle.length)}</>;
}
