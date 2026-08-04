import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kovifinance.ru";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    // Политика ПДн обязательна: на неё ссылается согласие в форме заявки.
    { url: `${base}/confidentiality`, changeFrequency: "yearly", priority: 0.3 },
    // Посадочные /zalogi_kred и /asv_kred в первый запуск НЕ выкатываем: цифры в них
    // не подтверждены заказчиком. Код остаётся, страницы закрыты noindex — вернуть
    // сюда, когда контент утвердят (и снять noindex в их metadata).
  ];
}
