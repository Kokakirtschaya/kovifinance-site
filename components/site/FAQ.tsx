"use client";

import { useState } from "react";
import { FAQ as ITEMS, CONTACTS } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function FAQ() {
  // null — свёрнуты все: список читается целиком, посетитель сам раскрывает нужное
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <Reveal className="text-center">
        <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-5xl">
          Частые <span className="text-brand">вопросы</span>
        </h2>
      </Reveal>

      <Reveal className="mt-10 divide-y divide-black/[0.08] rounded-2xl border border-black/[0.07] bg-white px-5 shadow-[var(--shadow-soft)] md:px-7">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-semibold tracking-tight">{item.q}</span>
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/10 text-lg transition-transform ${
                    isOpen ? "rotate-45 border-brand text-brand" : "text-muted"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden text-[15px] leading-relaxed text-muted">
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>

      <p className="mt-8 text-center text-sm text-muted">
        Не нашли ответ?{" "}
        <a href={CONTACTS.phoneHref} className="font-semibold text-brand hover:text-brand-dark">
          Позвоните нам
        </a>{" "}
        или{" "}
        <a href="#lead" className="font-semibold text-brand hover:text-brand-dark">
          оставьте заявку
        </a>{" "}
        — ответим.
      </p>
    </section>
  );
}
