"use client";

import { useEffect } from "react";

/**
 * Отмечает, что React ожил. Скрипт-страховка в layout ждёт этот класс:
 * не появился за 3 секунды — значит гидратация не прошла (упал бандл, оборвалась
 * сеть, ошибка в чужом скрипте), и тогда весь reveal-контент показывается принудительно.
 * Без этого страница остаётся белой: сервер отдаёт блоки с opacity: 0, а показать
 * их некому.
 */
export default function HydrationFlag() {
  useEffect(() => {
    document.documentElement.classList.add("hydrated");
  }, []);

  return null;
}
