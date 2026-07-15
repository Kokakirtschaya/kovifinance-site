import type { Metadata } from "next";
import { Golos_Text, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/site/SmoothScroll";
import ScrollProgress from "@/components/site/ScrollProgress";
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
    "Помогаем бизнесу получить кредиты, банковские гарантии, факторинг и лизинг на лучших условиях. Работаем с ведущими банками. Заявка — 5 минут, решение — до 3 дней.",
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
      "Кредиты, гарантии, факторинг и лизинг для бизнеса. Работаем с ведущими банками. Решение до 3 дней.",
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
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <CookieBanner />
        <YandexMetrica />
      </body>
    </html>
  );
}
