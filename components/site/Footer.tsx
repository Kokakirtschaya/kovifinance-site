import Link from "next/link";
import { NAV, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import Socials from "@/components/site/Socials";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-ink text-paper">
      <div className={`${SHELL} py-12 md:py-14`}>
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          <div className="col-span-2 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-inverse.svg" alt="KOVI Finance" className="h-8 w-auto" />
            <p className="mt-5 text-xl font-medium tracking-tight">Куём капитал</p>
            <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/60">Соединяем бизнес с банком и доводим сделку до результата.</p>
            <p className="mt-3 max-w-[38ch] text-xs leading-relaxed text-white/45">KOVI — от славянского «ковать». Выковываем финансовые решения для вашего бизнеса.</p>
          </div>
          <div>
            <p className="eyebrow text-white/50">Навигация</p>
            <ul className="mt-3 space-y-0.5 text-sm">
              {NAV.map(n => <li key={n.href}><a href={`/${n.href}`} className="inline-flex min-h-9 items-center text-white/75 hover:text-white">{n.label}</a></li>)}
              <li><Link href="/agents" className="inline-flex min-h-9 items-center text-white/75 hover:text-white">Агентам</Link></li>
              <li><Link href="/crm" className="inline-flex min-h-9 items-center text-white/75 hover:text-white">KOVI CRM</Link></li>
              <li><Link href="/lk" className="inline-flex min-h-9 items-center text-[#d9bd75] hover:text-white">Личный кабинет</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-white/50">На связи</p>
            <a href={CONTACTS.phoneHref} className="mt-4 block whitespace-nowrap text-sm font-medium text-white">{CONTACTS.phone}</a>
            <a href={CONTACTS.emailHref} className="mt-3 block break-words text-sm text-white/70 hover:text-white">{CONTACTS.email}</a>
            <Socials tone="dark" className="mt-5" />
          </div>
        </div>
        <div className="mt-9 grid gap-3 border-t border-white/15 pt-5 text-xs leading-relaxed text-white/55 lg:grid-cols-2">
          <p>© {new Date().getFullYear()} {CONTACTS.legalName}. Все права защищены.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end"><Link href="/confidentiality" className="underline-offset-2 hover:underline hover:text-white">Политика конфиденциальности</Link><p>Информация не является публичной офертой.</p></div>
        </div>
      </div>
    </footer>
  );
}
