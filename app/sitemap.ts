import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kovifinance.ru";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/agents`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/crm`, changeFrequency: "monthly", priority: 0.5 },
    // Политика ПДн обязательна: на неё ссылается согласие в форме заявки.
    { url: `${base}/confidentiality`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
