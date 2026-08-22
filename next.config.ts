import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Компактный self-contained сервер для контейнера (Timeweb Apps / Docker):
  // .next/standalone содержит только нужные node_modules и server.js.
  output: "standalone",

  // Разрешаем dev-серверу отдавать /_next/* на локальный IP — иначе при заходе
  // с телефона Next блокирует JS-чанки, страница не гидрируется и все блоки
  // с Reveal остаются на серверном opacity: 0, то есть пустыми.
  // На продакшен не влияет: настройка только для режима разработки.
  allowedDevOrigins: [
    "192.168.8.139",
    "192.168.11.106",
    "100.113.36.85",
  ],

  // В разработке не кэшируем оптимизированные картинки: путь у файла не меняется, и
  // оптимизатор продолжает отдавать старую версию (X-Nextjs-Cache: HIT) даже после
  // подмены исходника — приходится чистить .next/dev/cache/images и перезапускать сервер.
  // На проде остаётся значение по умолчанию.
  images: isDev ? { minimumCacheTTL: 0 } : undefined,

  async headers() {
    // Только в разработке: картинки и SVG правятся часто, а пути у них не меняются,
    // поэтому браузер отдаёт старое из кэша и приходится жать Cmd+Option+R.
    // На проде не применяется: там файлы должны кэшироваться.
    if (!isDev) return [];
    return [
      {
        source: "/:dir(decor|team|mood)/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
