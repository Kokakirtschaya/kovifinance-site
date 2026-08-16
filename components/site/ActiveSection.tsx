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

  useEffect(() => {
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
