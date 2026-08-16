"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/site";

/** Какой якорь меню сейчас в кадре. Пустая строка — герой / верх страницы. */
export function useActiveSection(): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const ids = NAV.map((n) => n.href.replace("#", "")).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const update = () => {
      const lead = document.getElementById("lead");
      const contacts = document.getElementById("contacts");
      const vh = window.innerHeight;

      const visible = (el: HTMLElement | null) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < vh - 40 && r.bottom > 80;
      };

      const nearBottom =
        vh + window.scrollY >= document.documentElement.scrollHeight - Math.max(200, vh * 0.25);

      // Форма заявки и футер — это «Контакты». Короткий подвал сам по себе
      // никогда не доезжает до старой линии в 1/3 экрана.
      if (nearBottom || visible(contacts) || (lead && lead.getBoundingClientRect().top < vh * 0.55)) {
        setActive("#contacts");
        return;
      }

      if (window.scrollY < vh * 0.35) {
        setActive("");
        return;
      }

      const line = vh / 3;
      let hash = "";
      for (const el of sections) {
        if (el.id === "contacts") continue;
        if (el.getBoundingClientRect().top <= line) hash = `#${el.id}`;
      }
      setActive(hash);
    };

    update();
    requestAnimationFrame(update);

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}
