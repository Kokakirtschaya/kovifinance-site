import { NextResponse } from "next/server";

/**
 * Приёмник клиентских ошибок: то, что упало в браузере, попадает в
 * «Логи приложения» Timeweb. Без этого белый экран у пользователя не оставляет
 * вообще никаких следов на сервере — а мы уже дважды чинили его вслепую и оба
 * раза сначала не туда.
 *
 * Эндпоинт публичный и потому нарочно тупой: ничего не хранит, ничего не
 * возвращает, режет длину полей и не пытается разбирать содержимое.
 */

export const dynamic = "force-dynamic";

/** Обрезка: в лог не должно попадать неограниченное содержимое из браузера. */
const cut = (value: unknown, max: number) =>
  typeof value === "string" ? value.slice(0, max) : undefined;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.error("CLIENT_ERROR", {
    kind: cut(body.kind, 40),
    message: cut(body.message, 500),
    stack: cut(body.stack, 2000),
    digest: cut(body.digest, 80),
    buildId: cut(body.buildId, 40),
    url: cut(body.url, 300),
    userAgent: cut(body.userAgent, 300),
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
