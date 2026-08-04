import { PROCESS } from "@/lib/site";
import StepsSection, { type Advantage } from "@/components/site/StepsSection";

const ADVANTAGES: Advantage[] = [
  {
    title: "Оплата за результат",
    desc: "Комиссия — только после того, как вы получили деньги.",
    icon: "result",
    decor: { src: "/decor/cash-register.svg", box: "w-[60%] max-h-[78%]" },
  },
  {
    title: "Знаем, куда подаваться",
    desc: "Опыт сделок показывает, какой банк берётся за вашу отрасль и структуру. Туда и идём.",
    icon: "banks",
    decor: { src: "/decor/banks.svg", box: "w-[88%] max-h-[78%]" },
  },
  {
    title: "Сложные кейсы",
    desc: "Берёмся там, где банки отказывают напрямую.",
    icon: "cases",
    decor: { src: "/decor/cases.svg", box: "w-[60%] max-h-[78%]" },
  },
  {
    title: "Личный менеджер",
    desc: "Один человек ведёт вашу сделку от заявки до денег.",
    icon: "manager",
    decor: { src: "/decor/manager.svg", box: "w-[60%] max-h-[78%]" },
  },
];

export default function Process() {
  return (
    <StepsSection
      id="process"
      title={
        <>
          Четыре шага до <span className="text-brand">финансирования</span>
        </>
      }
      subtitle="Берём на себя переговоры с банком или находим вам инвестора. Вы занимаетесь в это время своим бизнесом."
      steps={PROCESS}
      advantages={ADVANTAGES}
    />
  );
}
