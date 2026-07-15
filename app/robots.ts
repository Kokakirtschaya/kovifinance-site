import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/lk"], // личный кабинет не индексируем
    },
    sitemap: "https://kovifinance.ru/sitemap.xml",
    host: "https://kovifinance.ru",
  };
}
