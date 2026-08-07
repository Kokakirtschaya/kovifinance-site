"use client";

import { useEffect } from "react";
import { NAV } from "@/lib/site";

/**
 * Держит якорь в адресной строке в соответствии с секцией, которую видно.
 *
 * Зачем: раньше якорь оставался от последнего клика по меню. Прокрутил от «Услуг»
 * до «О компании», нажал F5 — браузер уходил по адресу, то есть обратно в услуги.
 * Теперь адрес всегда указывает на текущую секцию, поэтому перезагрузка возвращает
 * туда же, где ты был, а ссылку на нужный блок можно просто скопировать из адреса.
 *
 * replaceState, а не pushState: иначе прокрутка забила бы историю браузера и
 * кнопка «назад» перестала бы работать.
 */
export default function ActiveSection() {
  useEffect(() => {
    const ids = [...NAV.map((n) => n.href.slice(1)), "lead"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    let current = "";

    const apply = (hash: string) => {
      if (hash === current) return;
      current = hash;
      history.replaceState(null, "", hash || window.location.pathname);
    };

    const update = () => {
      // Активна секция, чей верх выше линии в трети экрана, — та, что читают сейчас.
      const line = window.innerHeight / 3;
      let active = "";
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) active = `#${el.id}`;
      }
      // У самого верха страницы адрес держим чистым — это главная, а не якорь.
      apply(window.scrollY < window.innerHeight / 2 ? "" : active);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    };

    // Начальное состояние не трогаем: если пришли по ссылке с якорем,
    // браузер сам прокрутит куда надо, и только потом включается слежение.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
