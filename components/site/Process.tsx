import { PROCESS } from "@/lib/site";
import StepsSection, { type Advantage } from "@/components/site/StepsSection";

const ADVANTAGES: Advantage[] = [
  {
    title: "Оплата за результат",
    desc: "Комиссия только после того, как вы получили деньги.",
    icon: "result",
  },
  {
    title: "Знаем, куда подаваться",
    desc: "Опыт сделок показывает, какой банк берётся за вашу отрасль и структуру. Туда и идём.",
    icon: "banks",
  },
  {
    title: "Сложные кейсы",
    desc: "Берёмся там, где банки отказывают напрямую.",
    icon: "cases",
  },
  {
    title: "Личный менеджер",
    desc: "Один человек ведёт вашу сделку от заявки до денег.",
    icon: "manager",
  },
];

export default function Process() {
  return (
    <StepsSection
      id="process"
      title="От задачи до финансирования"
      subtitle="Берём на себя подготовку сделки и переговоры с банками. На каждом этапе вы знаете, что происходит и какой шаг следующий."
      steps={PROCESS}
      advantages={ADVANTAGES}
    />
  );
}
