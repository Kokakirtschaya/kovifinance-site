import { NextResponse } from "next/server";

/**
 * Идентификатор текущей сборки. По нему открытая вкладка понимает, что на
 * сервере уже другая версия сайта, и обновляется до того, как попробует
 * догрузить чанк, которого больше нет (см. components/site/ErrorGuard.tsx).
 *
 * NEXT_PUBLIC_BUILD_ID подставляется на этапе `next build` (задаётся в
 * Dockerfile) и вшивается в код — и в клиентский бандл, и сюда. Поэтому обе
 * стороны сравнивают значения ОДНОЙ сборки, а не то, что оказалось в
 * окружении процесса. Локально переменной нет: везде "dev", расхождений нет.
 */

// Ответ обязан быть живым: закэшированный build id сделал бы проверку
// бессмысленной ровно в тот момент, когда она нужна.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { id: process.env.NEXT_PUBLIC_BUILD_ID ?? "dev" },
    { headers: { "Cache-Control": "no-store, must-revalidate" } },
  );
}
