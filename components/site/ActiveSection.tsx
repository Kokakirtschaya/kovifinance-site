"use client";

import { useEffect, useRef } from "react";
import { useActiveSection } from "@/lib/use-active-section";

/**
 * Держит якорь в адресной строке в соответствии с секцией, которую видно.
 * Подсветка пункта меню живёт в Header через тот же хук.
 */
export default function ActiveSection() {
  const active = useActiveSection();
  const skipFirstEmpty = useRef(true);
  const navigating = useRef(false);

  useEffect(() => {
    // Смена якоря через History API может отменить ещё загружающийся маршрут
    // Next.js. После клика на другую страницу перестаём синхронизировать URL.
    const onLinkClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin) return;
      navigating.current = destination.pathname !== window.location.pathname || destination.search !== window.location.search;
    };
    document.addEventListener("click", onLinkClick, true);
    return () => document.removeEventListener("click", onLinkClick, true);
  }, []);

  useEffect(() => {
    if (navigating.current || window.location.pathname !== "/") return;
    if (skipFirstEmpty.current) {
      skipFirstEmpty.current = false;
      if (!active) return;
    }
    const next = active || window.location.pathname;
    if ((active || "") === (window.location.hash || "")) return;
    history.replaceState(null, "", next);
  }, [active]);

  return null;
}
