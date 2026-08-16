"use client";

import { useEffect, useRef } from "react";

/**
 * Зелёная полоска сверху — куда докрутили страницу.
 *
 * CSS scroll-timeline, где браузер умеет. Иначе — один обработчик scroll
 * (не пружина и не вечный rAF: из-за них Safari белил вкладку).
 */
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cssOk =
      typeof CSS !== "undefined" &&
      typeof CSS.supports === "function" &&
      CSS.supports("animation-timeline", "scroll()");
    if (cssOk) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      data-scroll-progress
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
    />
  );
}
