"use client";

import { motion } from "motion/react";

/**
 * Декоративный узор для тёмных карточек: шевроны из фирменного знака.
 * Фона нет — только линии, поэтому ложится на любую подложку.
 */
export default function CardChevrons() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      fill="none"
      className="pointer-events-none absolute -right-4 -top-6 h-36 w-36 text-gold-bright"
    >
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${18 + i * 17} 18 L${40 + i * 17} 50 L${18 + i * 17} 82`}
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 0.16 - i * 0.04, x: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}
