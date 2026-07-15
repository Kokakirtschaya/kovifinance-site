import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Разрешаем dev-серверу отдавать /_next/* на локальный IP — иначе при заходе
  // с телефона Next блокирует JS-чанки, страница не гидрируется и все блоки
  // с Reveal остаются на серверном opacity: 0, то есть пустыми.
  // На продакшен не влияет: настройка только для режима разработки.
  allowedDevOrigins: ["192.168.8.139"],

  async headers() {
    // Только в разработке: анимированные SVG правятся часто, а путь у них не меняется,
    // поэтому браузер отдаёт старую версию из кэша и приходится жать Cmd+Option+R.
    // no-store выключает кэш для них целиком — обычного обновления достаточно.
    // На проде не применяется: там файлы должны кэшироваться.
    if (!isDev) return [];
    return [
      {
        source: "/decor/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
