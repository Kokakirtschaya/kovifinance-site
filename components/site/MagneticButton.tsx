"use client";

import { useRef } from "react";

export default function MagneticButton({
  href,
  className = "",
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const pos = useRef({ x: 0, y: 0 });

  const apply = (scale: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) scale(${scale})`;
  };

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    // равные коэффициенты по осям — тяга симметрична, максимум ~14px
    pos.current = {
      x: (e.clientX - (r.left + r.width / 2)) * 0.2,
      y: (e.clientY - (r.top + r.height / 2)) * 0.2,
    };
    apply(1);
  };

  const reset = () => {
    pos.current = { x: 0, y: 0 };
    apply(1);
  };

  // тактильный отклик на нажатие (работает и на тач: pos = 0,0 → чистый scale)
  const press = () => apply(0.97);
  const release = () => apply(1);

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      className={className}
      style={{ transition: "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </a>
  );
}
