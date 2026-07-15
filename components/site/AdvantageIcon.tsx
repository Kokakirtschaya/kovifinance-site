"use client";

import { motion, type Variants } from "motion/react";

export type AdvantageIconName = "result" | "banks" | "cases" | "manager" | "shield";

/** Линия «прорисовывается» при попадании в экран; custom — порядок в штрихе */
const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.15, delay: 0.15 + i * 0.12 },
    },
  }),
};

/** Для сплошных элементов, которые нельзя «нарисовать» линией */
const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 320, damping: 18, delay: 0.35 + i * 0.12 },
  }),
};

function Result() {
  return (
    <>
      <motion.circle cx="12" cy="12" r="8.6" variants={draw} custom={0} />
      {/* Знак рубля: стойка с чашей и перекладина */}
      <motion.path d="M10 16.6V7.6h2.5a2.4 2.4 0 0 1 0 4.8H10" variants={draw} custom={1} />
      <motion.path d="M8.3 14.3h4.7" variants={draw} custom={2} />
    </>
  );
}

function Banks() {
  return (
    <>
      <motion.path d="M3.6 9.6 12 4.2l8.4 5.4" variants={draw} custom={0} />
      <motion.path d="M3.2 20h17.6" variants={draw} custom={1} />
      <motion.path d="M7 11.8V17.6" variants={draw} custom={2} />
      <motion.path d="M12 11.8V17.6" variants={draw} custom={3} />
      <motion.path d="M17 11.8V17.6" variants={draw} custom={4} />
    </>
  );
}

function Cases() {
  return (
    <>
      {/* Дужка приподнимается на ховере — «открываем то, что закрыто» */}
      <motion.path
        className="transition-transform duration-300 group-hover:-translate-y-[1.5px]"
        d="M8.4 10.6V7.6a3.6 3.6 0 0 1 7.2 0v3"
        variants={draw}
        custom={0}
      />
      <motion.rect x="5" y="10.6" width="14" height="9" rx="2.2" variants={draw} custom={1} />
      <motion.circle
        cx="12"
        cy="15.1"
        r="1.5"
        className="fill-gold-bright stroke-none"
        style={{ transformOrigin: "12px 15.1px" }}
        variants={pop}
        custom={0}
      />
    </>
  );
}

function Manager() {
  return (
    <>
      <motion.circle cx="11.5" cy="8.4" r="3.3" variants={draw} custom={0} />
      <motion.path d="M5.2 19.6a6.3 6.3 0 0 1 12.6 0" variants={draw} custom={1} />
      {/* Точка «на связи» */}
      <motion.circle
        cx="18.6"
        cy="6"
        r="2"
        className="fill-gold-bright stroke-none"
        style={{ transformOrigin: "18.6px 6px" }}
        variants={pop}
        custom={1}
      />
    </>
  );
}

function Shield() {
  return (
    <>
      <motion.path
        d="M12 3.6 5.8 6v5.4c0 4 2.5 7.3 6.2 9 3.7-1.7 6.2-5 6.2-9V6z"
        variants={draw}
        custom={0}
      />
      <motion.path d="m9.2 12.1 1.9 1.9 3.7-3.9" variants={draw} custom={1} />
    </>
  );
}

const ICONS: Record<AdvantageIconName, () => React.ReactElement> = {
  result: Result,
  banks: Banks,
  cases: Cases,
  manager: Manager,
  shield: Shield,
};

export default function AdvantageIcon({ name }: { name: AdvantageIconName }) {
  const Shape = ICONS[name];
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[22px] w-[22px] stroke-gold-bright transition-transform duration-300 group-hover:scale-110"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <Shape />
    </motion.svg>
  );
}
