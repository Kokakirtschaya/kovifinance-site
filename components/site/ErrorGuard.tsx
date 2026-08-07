"use client";

import { useEffect } from "react";
import {
  BUILD_ID,
  isStaleChunkError,
  reloadOnce,
  reportClientError,
} from "@/lib/client-reload";

/**
 * Сторож страницы: чинит белый экран сам и рассказывает в логи, что случилось.
 *
 * Закрывает три сценария, ни один из которых не виден в error.tsx (тот ловит
 * только ошибки рендера React):
 *
 * 1. Устаревшие чанки. Вкладка висит открытой, выходит новый деплой — старые
 *    JS-файлы с хешами исчезают с сервера. Первая же догрузка чанка падает,
 *    и страница белеет. Лечится перезагрузкой.
 * 2. Разошедшаяся сборка. При возврате на вкладку сверяем свой BUILD_ID с тем,
 *    что отдаёт сервер. Разошлись — перезагружаемся, не дожидаясь падения.
 *    Заодно это единственная защита от кэша Safari, который умеет держать
 *    старую версию страницы даже после Cmd+Shift+R.
 * 3. Страница вернулась пустой. Прямая проверка симптома, а не его причины:
 *    если после разморозки вкладки на экране нечего показать — перезагрузка.
 *
 * Правило, выведенное прошлой охотой за белым экраном: страховка должна
 * проверять РЕЗУЛЬТАТ (видит ли пользователь контент), а не признак жизни
 * (сгидрировался ли React) — React может быть жив, а экран пуст.
 */
export default function ErrorGuard() {
  useEffect(() => {
    // --- 1. Ошибки, до которых error.tsx не дотягивается ---

    const onError = (event: ErrorEvent) => {
      const message = event.message || String(event.error ?? "");
      if (isStaleChunkError(message)) {
        reloadOnce(`stale-chunk: ${message}`);
        return;
      }
      reportClientError({
        kind: "window.error",
        message,
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : String(reason ?? "");
      if (isStaleChunkError(message)) {
        reloadOnce(`stale-chunk: ${message}`);
        return;
      }
      reportClientError({
        kind: "unhandledrejection",
        message,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // --- 2 и 3. Проверки при возвращении к вкладке ---

    /** Пусто ли на экране. Порог с запасом: у живой страницы высота в тысячах. */
    const looksBlank = () => {
      const root = document.querySelector("main") ?? document.body;
      return !root || root.getBoundingClientRect().height < 50;
    };

    const checkOnReturn = async () => {
      if (document.visibilityState !== "visible") return;

      if (looksBlank()) {
        reloadOnce("blank-page");
        return;
      }

      // Сборка на сервере уже другая? Тогда наши чанки скоро перестанут
      // существовать — обновляемся заранее, пока ничего не сломалось.
      try {
        const res = await fetch("/api/build", { cache: "no-store" });
        if (!res.ok) return;
        const data: { id?: string } = await res.json();
        if (data.id && data.id !== BUILD_ID) {
          reloadOnce(`stale-build: ${BUILD_ID} → ${data.id}`);
        }
      } catch {
        // Сети нет — не наше дело, молчим
      }
    };

    const onVisibility = () => {
      void checkOnReturn();
    };

    // Возврат из bfcache (Safari выгружает фоновые вкладки особенно охотно):
    // событие приходит с persisted = true и без него ничего бы не проверилось.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void checkOnReturn();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
