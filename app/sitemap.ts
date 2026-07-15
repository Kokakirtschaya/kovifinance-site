import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://kovifinance.ru";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/confidentiality`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
