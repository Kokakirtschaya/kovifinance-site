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
      const doc = document.documentElement;
      const bottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 80;
      // Форма заявки и короткий футер почти никогда не пересекают «линию»
      // в трети экрана — иначе «Контакты» не загораются до самого низа.
      if (bottom) {
        setActive("#contacts");
        return;
      }
      if (window.scrollY < window.innerHeight * 0.45) {
        setActive("");
        return;
      }
      const line = window.innerHeight / 3;
      let hash = "";
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) hash = `#${el.id}`;
      }
      const lead = document.getElementById("lead");
      if (lead && lead.getBoundingClientRect().top <= line) hash = "#contacts";
      setActive(hash);
    };

    // Если открыли по якорю — не сбрасываем его, пока браузер не докрутит.
    if (window.location.hash) setActive(window.location.hash);
    else update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return active;
}
