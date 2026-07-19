"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";

const nf = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

export default function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.1,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const value = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const final = `${prefix}${nf.format(to)}${suffix}`;
    // reduced-motion: сразу финальное значение, без тика
    if (reduce) {
      if (ref.current) ref.current.textContent = final;
      return;
    }
    const controls = animate(value, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${prefix}${nf.format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration, value, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}0{suffix}
    </span>
  );
}
