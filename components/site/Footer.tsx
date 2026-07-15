import { NAV, CONTACTS } from "@/lib/site";
import Socials from "@/components/site/Socials";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-28 md:pb-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-inverse.svg" alt="KOVI Finance" className="h-9 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Эксперт по финансированию и банковским инструментам для бизнеса.
              Кредиты, гарантии, факторинг, лизинг и проектное финансирование.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Навигация
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/70 transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40">
              Контакты
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={CONTACTS.phoneHref} className="text-white/80 hover:text-white">
                  {CONTACTS.phone}
                </a>
              </li>
              <li>
                <a href={CONTACTS.emailHref} className="text-white/70 hover:text-white">
                  {CONTACTS.email}
                </a>
              </li>
            </ul>
            <Socials tone="dark" className="mt-5" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {CONTACTS.legalName}. Все права защищены.</p>
          <p>Информация на сайте не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
