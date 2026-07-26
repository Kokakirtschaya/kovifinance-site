# Образ сайта kovifinance.ru для Timeweb Cloud Apps.
# Сборка многоступенчатая: тяжёлые node_modules остаются в промежуточных слоях,
# в финальный образ едет только standalone-вывод Next (см. output: "standalone"
# в next.config.ts) плюс Prisma CLI для миграций при старте.

FROM node:22-alpine AS base
# Next в standalone-режиме и Prisma тянут нативные модули, которым нужен libc-шим.
RUN apk add --no-cache libc6-compat


# ---------- Зависимости ----------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci


# ---------- Сборка ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Клиент Prisma генерируется в lib/generated/prisma и импортируется кодом,
# поэтому его нужно создать ДО next build, иначе сборка не найдёт модуль.
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build


# ---------- Рантайм ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# server.js по умолчанию слушает localhost — в контейнере это значит «никто
# снаружи не достучится». Timeweb пробрасывает порт 3000.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# standalone не копирует public и .next/static сам — это делаем руками,
# иначе сайт поднимется без картинок, шрифтов и JS-чанков.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Шрифт для OG-картинки: opengraph-image.tsx читает его в рантайме по
# process.cwd(), трассировка Next такой путь не видит и в standalone не кладёт.
COPY --from=builder /app/assets ./assets

# Схема и миграции: нужны, чтобы прогнать migrate deploy при старте.
# В Prisma 7 строка подключения задаётся только в prisma.config.ts, поэтому он
# тоже едет в образ вместе с dotenv — config его импортирует и ищет рядом с собой.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv

# Prisma CLI ставим отдельным префиксом, а не копируем куски node_modules из
# builder: у CLI своё дерево зависимостей (effect и прочее), выборочная копия
# разваливается на старте с MODULE_NOT_FOUND — проверено. Отдельный префикс
# заодно не даёт npm тронуть package.json, который standalone сгенерировал сам.
COPY --from=builder /app/package.json /tmp/app-package.json
RUN npm install --prefix /opt/prisma-cli --no-save --omit=optional \
      "prisma@$(node -p "require('/tmp/app-package.json').devDependencies.prisma")" \
    && rm /tmp/app-package.json \
    && npm cache clean --force \
    # prisma.config.ts импортирует "prisma/config", а ищет его рядом с собой,
    # в /app/node_modules. Симлинк закрывает вопрос: свои зависимости CLI
    # подтянет по реальному пути в /opt, куда Node идёт, разыменовав ссылку.
    && ln -s /opt/prisma-cli/node_modules/prisma /app/node_modules/prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
