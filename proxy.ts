import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { contentSecurityPolicy } from "@/lib/csp";

export function proxy(request: NextRequest) {
  const nonce = randomBytes(16).toString("base64");
  const policy = contentSecurityPolicy(nonce, process.env.NODE_ENV === "development");
  const requestHeaders = new Headers(request.headers);

  // Не доверяем nonce и политике из входящего запроса. Next.js читает этот
  // заголовок при SSR и добавляет nonce к своим скриптам и потоковому HTML.
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);
  requestHeaders.delete("Content-Security-Policy-Report-Only");

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  // HTML и RSC с одноразовым nonce нельзя повторно отдавать из общего кэша.
  response.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
  return response;
}

export const config = {
  matcher: [
    // Страницы, 404 и переходы RSC, включая prefetch. Исключаем только API
    // и каталоги/файлы ресурсов; HTML-ответы Auth.js покрываем отдельно.
    "/((?!api/|_next/|brand/|crm/|decor/|mood/|team/|favicon\\.ico$|icon\\.png$|apple-icon\\.png$|opengraph-image$|robots\\.txt$|sitemap\\.xml$).*)",
    "/api/auth/:path*",
  ],
};
