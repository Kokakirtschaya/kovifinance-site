"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Появление блока при прокрутке.
 *
 * Раньше здесь был whileInView из motion — и на Safari блоки оставались невидимыми
 * до первого движения мыши: проверка видимости не срабатывала сама, страница висела
 * белой. Теперь наблюдаем сами: IntersectionObserver сообщает о состоянии сразу,
 * как только начинает следить, поэтому видимые блоки показываются в первом же кадре.
 *
 * Сама анимация — на CSS (globals.css, правила для [data-reveal]). Сервер отдаёт
 * разметку без скрытия: контент прячется только когда JS точно жив (класс .js),
 * иначе страница осталась бы пустой при любом сбое скриптов.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // reduced-motion: показываем сразу, без движения
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    // Сначала смотрим сами: если блок уже на экране, показываем немедленно.
    // Не полагаемся на наблюдателя — на Safari он молчал до движения мыши,
    // и страница оставалась белой, хотя React был жив.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "-12% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal
      data-shown={shown ? "" : undefined}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
