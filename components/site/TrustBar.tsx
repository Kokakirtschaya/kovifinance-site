import { SHELL } from "@/lib/layout";
import SiteIcon from "@/components/site/SiteIcon";

export default function TrustBar() {
  return (
    <div className="border-b border-black/[0.08] bg-paper-2/60">
      <ul className={`${SHELL} grid gap-4 py-6 text-sm text-ink/80 sm:grid-cols-3 sm:gap-6 sm:py-7`}>
        {[
          ["banks", "Подбираем банк под вашу задачу"],
          ["manager", "Работаем напрямую с основателем"],
          ["result", "Получаем оплату за результат"],
        ].map(([icon, label]) => (
          <li key={icon} className="flex items-center gap-3"><SiteIcon name={icon} className="size-5 shrink-0 text-brand" />{label}</li>
        ))}
      </ul>
    </div>
  );
}
