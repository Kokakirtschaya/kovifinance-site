import { SHELL } from "@/lib/layout";

const TASKS = [
  {
    title: "Закрыть кассовый разрыв",
    text: "Заказ уже есть, а оплата придёт позже. Разбираем денежный поток и подбираем оборотный кредит, факторинг или контрактное финансирование.",
  },
  {
    title: "Найти средства на развитие",
    text: "Нужны оборудование, новый объект или запуск проекта. Оцениваем структуру финансирования и возможность использовать недвижимость в качестве залога.",
  },
  {
    title: "Разобраться с отказом банка",
    text: "Изучаем причины отказа, отчётность и обеспечение. Определяем, что нужно изменить в заявке и какие банки могут рассмотреть сделку.",
  },
];

export default function BusinessTasks() {
  return (
    <section id="tasks" className={`${SHELL} pb-14 md:pb-20`}>
      <h2 className="section-heading max-w-[25ch]">С какими задачами помогаем</h2>
      <p className="mt-4 max-w-[55ch] text-base leading-relaxed text-muted">Начинаем с ситуации вашего бизнеса. Затем выбираем финансовый инструмент.</p>
      <div className="mt-8 grid gap-7 md:grid-cols-3 md:gap-8">
        {TASKS.map((task, i) => (
          <article key={task.title} className="border-t border-black/15 pt-5">
            <p className="text-xs tabular-nums text-brand">0{i + 1}</p>
            <h3 className="mt-3 text-xl font-medium leading-tight tracking-tight">{task.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{task.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
