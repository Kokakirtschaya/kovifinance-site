import { AGENTS_PROCESS } from "@/lib/site";
import StepsSection, { type Advantage } from "@/components/site/StepsSection";

// TODO: тексты под агентов — пока копия клиентских, правим по месту.
const ADVANTAGES: Advantage[] = [
  {
    title: "Процент от комиссии",
    desc: "Получаете долю нашего вознаграждения — после того, как клиент рассчитался по сделке, до 20–25%!",
    icon: "result",
    decor: { src: "/decor/commission.svg", box: "w-[72%] max-h-[78%]" },
  },
  {
    title: "Вся работа на нас",
    desc: "Переговоры, документы, банки. Ваше дело — передать контакт.",
    icon: "manager",
    decor: { src: "/decor/work.svg", box: "w-[72%] max-h-[78%]" },
  },
];

export default function Agents() {
  return (
    // Фон отличает блок от «Клиентам» выше — иначе две одинаковые белые секции подряд
    <StepsSection
      id="agents"
      className="bg-paper-2/60"
      title={
        <>
          Два шага до <span className="text-brand">получения комиссии</span>
        </>
      }
      subtitle="Берём на себя переговоры с клиентом. Вы занимаетесь в это время своим бизнесом и поиском новых клиентов. После закрытия сделки получаете комиссию."
      steps={AGENTS_PROCESS}
      advantages={ADVANTAGES}
    />
  );
}
