# Деплой на Timeweb Cloud (Apps + Managed PostgreSQL)

Цель: перенести сайт с локалки на прод в РФ (Timeweb Cloud), домен — на регистратора
Timeweb (из-за требования ЕСИА к идентификации администраторов доменов).

Порядок важен: домен и репозиторий готовим первыми, DNS переключаем — последним.

---

## 0. Предусловия

- [ ] Аккаунт Timeweb (есть).
- [ ] Репозиторий на GitHub/GitLab (сейчас репо локальный — нужно завести remote и запушить).
      Приватный репозиторий подойдёт. `.env` не коммитим (уже в `.gitignore`).

## 1. Перенос домена kovifinance.ru → Timeweb (регистратор)

Причина: Tilda Domains может не успеть внедрить идентификацию через ЕСИА к 1 сентября.

- [ ] В Tilda Domains: снять блокировку переноса, получить код авторизации (auth-code / EPP).
- [ ] Убедиться, что e-mail администратора домена доступен (на него придёт подтверждение).
- [ ] В Timeweb: инициировать перенос домена, ввести код, оплатить (перенос обычно продлевает на год).
- [ ] Пройти идентификацию администратора через Госуслуги (ЕСИА).
- [ ] Сразу прописать у Timeweb **текущие DNS-записи** (как в Тильде), чтобы сайт не «отвалился»
      на время переноса. DNS переключим на новый хостинг позже (шаг 6).

## 2. Managed PostgreSQL (Timeweb Cloud)

- [ ] Создать кластер Managed PostgreSQL (регион — РФ).
- [ ] Создать БД и пользователя, скопировать строку подключения (`DATABASE_URL`),
      формат: `postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require`.
- [ ] Разрешить подключение с приложения (белый список IP / внутренняя сеть).

## 3. Переключение кода на PostgreSQL (делаем вместе, когда есть строка из шага 2)

Что меняется в репозитории:
- `prisma/schema.prisma`: `provider = "sqlite"` → `provider = "postgresql"`.
- `lib/prisma.ts`: адаптер `@prisma/adapter-better-sqlite3` → `@prisma/adapter-pg`.
- `package.json`: убрать `better-sqlite3` + `@prisma/adapter-better-sqlite3`,
  добавить `pg` + `@prisma/adapter-pg`.
- Локальная разработка: поднять Postgres через `docker compose up` (файл добавим),
  `DATABASE_URL` в `.env` — на локальный Postgres.
- Миграция: `npx prisma migrate dev --name init_postgres` (локально) →
  на проде `npx prisma migrate deploy`.

## 4. Cloud App (Timeweb)

- [ ] Создать App, подключить Git-репозиторий (ветка `main`).
- [ ] Тип сборки: Dockerfile (добавим в репозиторий) или Next.js-пресет.
- [ ] Build: `next build` (уже `output: "standalone"`), Start: `node server.js`.
- [ ] Прописать переменные окружения (шаг 5).
- [ ] Первый деплой — на временный домен Timeweb, проверить работу.

## 5. Переменные окружения на проде

- [ ] `DATABASE_URL` — Managed PostgreSQL (шаг 2).
- [ ] `AUTH_SECRET` — новый секрет (`openssl rand -base64 32`), НЕ из локалки.
- [ ] `AUTH_URL` — `https://kovifinance.ru`.
- [ ] `SMTP_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM` — **боевой** SMTP (почта на домене
      kovifinance.ru), а не тестовый Ethereal. Нужен для магик-линка в ЛК.
- [ ] `CRM_API_URL` = `https://crm.kovifinance.ru`, `CRM_API_TOKEN` = `PUBLIC_API_TOKEN` в CRM.
- [ ] `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — чтобы заявки уходили в Telegram.
- [ ] `CHECKO_API_KEY`, `CHECKO_BASE_URL` — проверка ИНН в форме.

## 6. Переключение DNS (последний шаг)

- [ ] Убедиться, что сайт на временном домене Timeweb полностью работает
      (главная, форма → CRM/Telegram, проверка ИНН, вход в ЛК по магик-линку).
- [ ] Выпустить SSL для kovifinance.ru (Timeweb/Let's Encrypt).
- [ ] Переключить A/CNAME записи домена на Cloud App.
- [ ] Tilda не выключать, пока новый прод не подтверждён.

## 7. Юридическое (параллельно, вне кода — подтвердить с юристом)

- [ ] Уведомление в Роскомнадзор как оператор персональных данных.
- [ ] Проверить согласие на обработку ПДн (галочка в форме есть) и политику
      конфиденциальности (страница `/confidentiality` есть).
