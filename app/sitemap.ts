import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kovifinance.ru";
  return [
    // Сайт — это главная и личный кабинет. Посадочные под отдельные запросы
    // (/zalogi_kred, /asv_kred) удалены 2026-08-05, от них отказались.
    { url: base, changeFrequency: "weekly", priority: 1 },
    // Политика ПДн обязательна: на неё ссылается согласие в форме заявки.
    { url: `${base}/confidentiality`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
