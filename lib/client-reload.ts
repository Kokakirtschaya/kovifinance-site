/**
 * Общая механика самовосстановления страницы: перезагрузка с защитой от петли
 * и отправка клиентских ошибок в логи сервера.
 *
 * Зачем: при некоторых сбоях (устаревшие после деплоя JS-чанки, ошибка в
 * клиентском компоненте, подвисшая после разморозки вкладка Safari) страница
 * остаётся белой, и пользователю нечего нажать. Единственное надёжное лечение —
 * полная перезагрузка. Но безусловный reload на ошибку легко превращается в
 * бесконечный цикл, если ошибка воспроизводится и после обновления, поэтому
 * любая автоматическая перезагрузка проходит через кулдаун.
 */

/** Метка времени последней автоперезагрузки — переживает reload, но не вкладку. */
const RELOAD_KEY = "kovi:last-auto-reload";

/** Раньше этого срока второй раз не перезагружаемся — иначе петля. */
const RELOAD_COOLDOWN_MS = 60_000;

/** Идентификатор сборки. Подставляется на этапе `next build` (см. Dockerfile). */
export const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? "dev";

/**
 * Перезагрузить страницу, если недавно этого не делали.
 * @returns true, если перезагрузка запущена.
 */
export function reloadOnce(reason: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const prev = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - prev < RELOAD_COOLDOWN_MS) return false;
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // sessionStorage может быть недоступен (жёсткие настройки приватности).
    // Тогда защиты от петли нет — а значит и перезагружать нельзя: лучше
    // показать экран ошибки с кнопкой, чем зациклить браузер.
    return false;
  }

  reportClientError({ kind: "auto-reload", message: reason });
  window.location.reload();
  return true;
}

/** Ошибка загрузки JS-чанка — почти всегда «сборка на сервере уже другая». */
export function isStaleChunkError(message: string): boolean {
  return [
    "ChunkLoadError",
    "Loading chunk",
    "Loading CSS chunk",
    "Failed to fetch dynamically imported module",
    // Формулировка Safari для той же ситуации
    "Importing a module script failed",
    "error loading dynamically imported module",
  ].some((marker) => message.includes(marker));
}

/**
 * Отправить ошибку на сервер — она попадёт в «Логи приложения» Timeweb.
 * Молча и без ожидания: диагностика не должна мешать пользователю.
 */
export function reportClientError(payload: {
  kind: string;
  message: string;
  stack?: string;
  digest?: string;
}): void {
  if (typeof window === "undefined") return;

  try {
    const body = JSON.stringify({
      ...payload,
      // Обрезаем: в лог не нужны мегабайты стека
      stack: payload.stack?.slice(0, 2000),
      buildId: BUILD_ID,
      url: window.location.href,
      userAgent: window.navigator.userAgent,
    });

    // keepalive нужен, потому что сразу после отправки мы часто перезагружаем
    // страницу — обычный fetch браузер в этот момент отменит.
    void fetch("/api/clienterr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    // Диагностика не имеет права ронять страницу
  }
}
