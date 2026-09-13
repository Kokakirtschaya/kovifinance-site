"use client";

import { useEffect, useState } from "react";
import { CONTACTS } from "@/lib/site";
import { useCookieNoticeVisible } from "@/lib/use-cookie-notice";

export default function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const cookieVisible = useCookieNoticeVisible();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const hero = document.getElementById("hero-actions");
      const lead = document.getElementById("lead");
      const editing = document.activeElement?.matches("input, textarea, select, [contenteditable=true]");
      setVisible(Boolean(hero && hero.getBoundingClientRect().bottom < 80 && lead && lead.getBoundingClientRect().top > window.innerHeight * 0.9 && !editing));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
    };
  }, []);

  if (!visible || cookieVisible) return null;
  return (
    <div data-sticky-cta className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-black/10 bg-paper px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <a href={CONTACTS.phoneHref} className="button-secondary min-h-11 flex-1 border-black/15 px-3 py-3 text-ink">Позвонить</a>
      <a href="#lead" className="button-primary min-h-11 flex-[1.4] px-3 py-3">Обсудить задачу</a>
    </div>
  );
}
