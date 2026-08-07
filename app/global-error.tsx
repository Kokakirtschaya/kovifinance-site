"use client";

import { useEffect, useState } from "react";
import { reloadOnce, reportClientError } from "@/lib/client-reload";

/**
 * Последний рубеж: ошибка в самой корневой разметке, куда error.tsx не достаёт.
 * Этот файл ЗАМЕНЯЕТ root layout целиком, поэтому обязан отдавать свои <html> и
 * <body>, а метаданные здесь не поддерживаются — заголовок ставим тегом <title>.
 *
 * Стили — инлайновые, намеренно. Сюда попадают в том числе случаи, когда не
 * загрузился CSS, и полагаться на классы Tailwind означало бы показать поверх
 * белого экрана... другой белый экран.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const [reloading, setReloading] = useState(true);

  useEffect(() => {
    reportClientError({
      kind: "react-global-error",
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
    setReloading(reloadOnce(`react-global-error: ${error.message}`));
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbfaf7",
          color: "#08130e",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "20px",
        }}
      >
        <title>Ошибка · KOVIFINANCE</title>

        {reloading ? (
          <p style={{ color: "#5b6672" }}>Обновляем страницу…</p>
        ) : (
          <div style={{ maxWidth: "420px", textAlign: "center" }}>
            <h1 style={{ fontSize: "26px", fontWeight: 600, margin: 0 }}>
              Сайт временно не открылся
            </h1>
            <p style={{ color: "#5b6672", marginTop: "12px", lineHeight: 1.55 }}>
              Попробуйте обновить страницу. Если не поможет — позвоните нам,
              заявку примем по телефону.
            </p>
            <div
              style={{
                marginTop: "28px",
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={() => unstable_retry()}
                style={{
                  border: 0,
                  cursor: "pointer",
                  borderRadius: "999px",
                  padding: "13px 26px",
                  fontSize: "15px",
                  fontWeight: 500,
                  background: "#1e7a57",
                  color: "#fff",
                }}
              >
                Попробовать снова
              </button>
              <a
                href="tel:+74996476006"
                style={{
                  borderRadius: "999px",
                  padding: "13px 26px",
                  fontSize: "15px",
                  fontWeight: 500,
                  textDecoration: "none",
                  color: "#08130e",
                  border: "1px solid rgba(8,19,14,0.15)",
                }}
              >
                +7 499 647-60-06
              </a>
            </div>
            {error.digest && (
              <p style={{ marginTop: "24px", fontSize: "12px", color: "#5b6672" }}>
                Код ошибки: {error.digest}
              </p>
            )}
          </div>
        )}
      </body>
    </html>
  );
}
