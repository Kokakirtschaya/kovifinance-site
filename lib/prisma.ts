import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Prisma 7: рантайм-клиент через driver adapter. PrismaPg сам держит пул
// соединений pg, строку берём из DATABASE_URL (postgresql://...).
//
// ⚠️ Клиент создаётся ЛЕНИВО, при первом обращении. Если создавать его прямо
// при импорте, падает сборка образа: `next build` вычисляет модули страниц,
// а базы на этапе сборки нет и не должно быть (проверено — контейнер не собрался).
// Значит, и ругаться на отсутствие DATABASE_URL можно только в рантайме.

// Клиент один на процесс: каждый новый — это отдельный пул соединений.
// В разработке держим его ещё и на globalThis, иначе хот-релоад плодит пулы.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined = globalForPrisma.prisma;

function getClient(): PrismaClient {
  if (client) return client;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL не задан — личный кабинет не сможет подключиться к базе");
  }

  client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}

// Прокси отдаёт настоящий клиент только когда у него что-то запрашивают,
// поэтому импорт модуля сам по себе к базе не обращается.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getClient(), property, receiver);
  },
});
