import { NAV, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";
import Socials from "@/components/site/Socials";

export default function Footer() {
  return (
    <footer id="contacts" className="bg-ink text-paper">
      <div className={`${SHELL} pt-16 pb-28 md:pb-16`}>
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-inverse.svg" alt="KOVI Finance" className="h-9 w-auto" />
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Эксперт по финансированию и банковским инструментам для бизнеса.
              Кредиты, гарантии, факторинг, лизинг и проектное финансирование.
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/40">
              KOVI от славянского «ковать»: мы выковываем финансовые решения.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/45">Навигация</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-white/70 transition-colors hover:text-white">
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="/lk"
                  className="inline-flex items-center gap-2 text-gold-bright transition-colors hover:text-white"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8.5" r="3.6" />
                    <path d="M4.6 20c1.4-3.6 4.1-5.4 7.4-5.4s6 1.8 7.4 5.4" />
                  </svg>
                  Личный кабинет
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/45">Контакты</h4>
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
