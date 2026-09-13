import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { clientIpFromHeaders } from "@/lib/rate-limit";

class LimitExceeded extends Error {}

/** Общий лимит выдачи ссылок: 5 на IP и 3 на адрес за 15 минут. */
export async function allowMagicLink(email: string, requestHeaders: Headers): Promise<boolean> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Auth rate limit requires AUTH_SECRET");

  // Один и тот же секрет на всех экземплярах приложения. Контакты и IP
  // в таблицу не записываем; ключи сохраняются при перезапуске приложения.
  const key = (scope: string, value: string) =>
    createHmac("sha256", secret).update(`${scope}:${value}`).digest("hex");
  const rules = [
    { key: key("ip", clientIpFromHeaders(requestHeaders)), limit: 5 },
    { key: key("email", email.trim().toLowerCase()), limit: 3 },
  ];

  try {
    // Удаляем только истёкшие записи небольшими порциями. Отдельный запрос
    // освобождает блокировки очистки до захвата счётчиков в транзакции.
    await prisma.$executeRaw`
      DELETE FROM "AuthRateLimit"
      WHERE "key" IN (
        SELECT "key" FROM "AuthRateLimit"
        WHERE "expiresAt" <= CURRENT_TIMESTAMP
        ORDER BY "expiresAt", "key"
        LIMIT 100
        FOR UPDATE SKIP LOCKED
      )
    `;

    await prisma.$transaction(async (tx) => {
      // Всегда берём лимиты в одном порядке: IP, затем адрес. UPSERT проверяет
      // и увеличивает счётчик атомарно даже при одновременных запросах.
      for (const rule of rules) {
        const accepted = await tx.$queryRaw<{ count: number }[]>`
          INSERT INTO "AuthRateLimit" ("key", "count", "expiresAt")
          VALUES (${rule.key}, 1, CURRENT_TIMESTAMP + INTERVAL '15 minutes')
          ON CONFLICT ("key") DO UPDATE SET
            "count" = CASE
              WHEN "AuthRateLimit"."expiresAt" <= CURRENT_TIMESTAMP THEN 1
              ELSE "AuthRateLimit"."count" + 1
            END,
            "expiresAt" = CASE
              WHEN "AuthRateLimit"."expiresAt" <= CURRENT_TIMESTAMP
                THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
              ELSE "AuthRateLimit"."expiresAt"
            END
          WHERE "AuthRateLimit"."expiresAt" <= CURRENT_TIMESTAMP
             OR "AuthRateLimit"."count" < ${rule.limit}
          RETURNING "count"
        `;
        // Откат обоих счётчиков: отказ по адресу не расходует лимит IP.
        if (accepted.length === 0) throw new LimitExceeded();
      }
    });
    return true;
  } catch (error) {
    if (error instanceof LimitExceeded) return false;
    // Отказ базы не должен превращаться в разрешение на отправку.
    throw error;
  }
}
