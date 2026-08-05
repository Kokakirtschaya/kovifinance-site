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

  // Managed PostgreSQL в Timeweb отдаёт сертификат, подписанный собственным CA.
  // pg такому не доверяет и рвёт соединение с «self-signed certificate», из-за чего
  // валится любой запрос Prisma — а Auth.js показывает это как error=Configuration,
  // будто сломана почта. Проверку сертификата отключаем, но только когда строка
  // подключения сама просит SSL: у локального Postgres его нет, и передавать туда
  // ssl-опции нельзя — соединение не установится.
  //
  // Канал при этом остаётся шифрованным, теряется только проверка подлинности
  // сертификата. Приемлемо: база доступна лишь по приватной сети Timeweb
  // (192.168.0.4) и наружу не смотрит. Правильное решение — подложить CA-сертификат
  // Timeweb, но его сначала нужно получить в поддержке.
  // ⚠️ Просто добавить ssl в конфиг недостаточно: pg разбирает строку подключения
  // ПОСЛЕ и накрывает ею явные опции — `Object.assign({}, config, parse(connectionString))`
  // в connection-parameters.js. Поэтому sslmode из URL побеждает, и rejectUnauthorized
  // до драйвера не доходит. Значит, sslmode нужно из строки убрать.
  //
  // Из DATABASE_URL его не выкидываем: ту же переменную читает `prisma migrate deploy`
  // при старте контейнера, у него отдельный движок со своими правилами разбора.
  const url = new URL(connectionString);
  const sslmode = url.searchParams.get("sslmode");
  const wantsSsl = sslmode !== null && sslmode !== "disable";
  url.searchParams.delete("sslmode");

  client = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: url.toString(),
      ...(wantsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
    }),
  });
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
