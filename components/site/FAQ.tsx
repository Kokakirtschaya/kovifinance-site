"use client";

import { useState } from "react";
import { FAQ as ITEMS, CONTACTS } from "@/lib/site";
import { SHELL } from "@/lib/layout";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className={`${SHELL} py-20 md:py-28`}>
      <h2 className="max-w-[12ch] text-3xl font-bold tracking-[-0.03em] md:text-5xl">
        Частые вопросы
      </h2>

      <div className="mt-10 border-t border-black/[0.08]">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-black/[0.08]">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left md:py-6"
                aria-expanded={isOpen}
              >
                <span className="text-base font-semibold tracking-tight md:text-lg">
                  {item.q}
                </span>
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border text-lg leading-none transition-transform ${
                    isOpen
                      ? "rotate-45 border-brand text-brand"
                      : "border-black/15 text-muted"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden text-[15px] leading-relaxed text-muted md:max-w-[65ch]">
                  {item.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-muted">
        Не нашли ответ?{" "}
        <a href={CONTACTS.phoneHref} className="font-semibold text-brand hover:text-brand-dark">
          Позвоните нам
        </a>{" "}
        или{" "}
        <a href="#lead" className="font-semibold text-brand hover:text-brand-dark">
          оставьте заявку
        </a>
        .
      </p>
    </section>
  );
}
