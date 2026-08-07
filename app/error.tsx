"use client";

import { useEffect, useState } from "react";
import { reloadOnce, reportClientError } from "@/lib/client-reload";

/**
 * Экран ошибки для всего, что ниже корневой разметки.
 *
 * Без этого файла Next в продакшене на любую необработанную ошибку клиентского
 * компонента размонтирует дерево React и оставляет пустой <body> — тот самый
 * «сайт просто белый», без единого намёка, что произошло.
 *
 * Поведение: сначала пробуем перезагрузиться сами (сбой чаще всего разовый —
 * протухший чанк, оборванный запрос). Если перезагрузка уже была только что,
 * reloadOnce вернёт false, и тогда показываем человеку экран с кнопками —
 * иначе получилась бы петля обновлений.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [reloading, setReloading] = useState(true);

  useEffect(() => {
    reportClientError({
      kind: "react-error-boundary",
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
    setReloading(reloadOnce(`react-error: ${error.message}`));
  }, [error]);

  if (reloading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5">
        <p className="text-muted">Обновляем страницу…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
          Страница не открылась
        </h1>
        <p className="mt-3 text-muted">
          Что-то пошло не так с нашей стороны. Попробуйте ещё раз — обычно
          помогает.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="rounded-full bg-brand px-6 py-3 font-medium text-white transition hover:bg-brand-dark"
          >
            Попробовать снова
          </button>
          <a
            href="/"
            className="rounded-full border border-ink/15 px-6 py-3 font-medium text-ink transition hover:border-ink/30"
          >
            На главную
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-muted">Код ошибки: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
