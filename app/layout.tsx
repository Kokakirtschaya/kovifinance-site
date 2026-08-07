import type { Metadata } from "next";
import { Golos_Text, Inter } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/site/ScrollProgress";
import HydrationFlag from "@/components/site/HydrationFlag";
import CookieBanner from "@/components/site/CookieBanner";
import YandexMetrica from "@/components/site/YandexMetrica";

// Основной шрифт бренда — Golos Text; Inter — запасной (по бренд-гайду)
const golos = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kovifinance.ru"),
  title: {
    default: "KOVIFINANCE — финансирование и банковские инструменты для бизнеса",
    template: "%s · KOVIFINANCE",
  },
  description:
    "Помогаем бизнесу получить кредиты, банковские гарантии, факторинг и лизинг. Знаем требования банков и по опыту сделок понимаем, куда подавать заявку. Заявка — 5 минут, решение — от 3 дней.",
  keywords: [
    "кредит для бизнеса",
    "банковская гарантия",
    "факторинг",
    "лизинг",
    "финансирование бизнеса",
    "тендерный кредит",
    "KOVIFINANCE",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://kovifinance.ru",
    siteName: "KOVIFINANCE",
    title: "KOVIFINANCE — финансирование и банковские инструменты для бизнеса",
    description:
      "Кредиты, гарантии, факторинг и лизинг для бизнеса. Знаем, в какой банк идти с вашей сделкой. Решение — от 3 дней.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${golos.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <noscript>
          {/* Без JS whileInView не срабатывает — принудительно показываем reveal-контент */}
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {/* Страховка от белой страницы: сервер отдаёт reveal-блоки с opacity: 0, и если
            JS не оживёт (упал бандл, оборвалась сеть, ошибка стороннего скрипта),
            показывать их будет некому. Скрипт ставит класс js сразу, а через 3 секунды
            проверяет, отметился ли React классом hydrated; не отметился — показываем всё. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;d.classList.add('js');setTimeout(function(){if(!d.classList.contains('hydrated'))d.classList.add('reveal-fallback')},1200)})()`,
          }}
        />
        <HydrationFlag />
        <ScrollProgress />
        {children}
        <CookieBanner />
        <YandexMetrica />
      </body>
    </html>
  );
}
