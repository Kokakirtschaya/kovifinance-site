"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Полоска прогресса прокрутки вверху страницы: пустая в начале, полная в конце.
 * z-[60] — выше липкой шапки (z-50), иначе она бы её перекрывала.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Пружина, а не сырое значение: с Lenis прокрутка идёт рывками по кадрам,
  // и полоска без сглаживания дёргается.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-brand"
    />
  );
}
