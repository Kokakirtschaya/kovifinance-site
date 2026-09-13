import { AGENTS_PROCESS } from "@/lib/site";
import StepsSection, { type Advantage } from "@/components/site/StepsSection";

const ADVANTAGES: Advantage[] = [
  {
    title: "Процент от комиссии",
    desc: "Получаете долю нашего вознаграждения после того, как клиент рассчитался по сделке, до 20-25%.",
    icon: "result",
  },
  {
    title: "Вся работа на нас",
    desc: "Переговоры, документы, банки. Ваше дело: передать контакт.",
    icon: "manager",
  },
];

export default function Agents() {
  return (
    <StepsSection
      id="agents"
      className="bg-paper-2/60"
      title="Два шага до комиссии"
      subtitle="Вы знакомите нас с клиентом. Мы разбираем задачу, ведём переговоры и сопровождаем получение финансирования."
      steps={AGENTS_PROCESS}
      advantages={ADVANTAGES}
    />
  );
}
