import Image from "next/image";
import { SERVICES } from "@/lib/site";
import { SHELL } from "@/lib/layout";

const PHOTOS: Record<string, { src: string; alt: string }> = {
  mortgage: {
    src: "/mood/services/mortgage.jpg",
    alt: "Стеклянный деловой центр в зелёно-золотом свете",
  },
  credit: {
    src: "/mood/services/credit.jpg",
    alt: "Досье сделки: договоры, папка и счётная машинка",
  },
  guarantee: {
    src: "/mood/services/guarantee.jpg",
    alt: "Папка с сургучной печатью и золотым перстнем",
  },
  factoring: {
    src: "/mood/services/factoring.jpg",
    alt: "Пачка отгрузочных документов на клипе",
  },
  leasing: {
    src: "/mood/services/leasing.jpg",
    alt: "Ключи и модель техники на папке сделки",
  },
  project: {
    src: "/mood/services/project.jpg",
    alt: "Архитектурный макет проекта рядом с чертежами",
  },
};

export default function Services() {
  return (
    <section id="services" className={`${SHELL} py-20 md:py-28`}>
      <h2 className="max-w-[20ch] font-bold tracking-[-0.03em] text-[clamp(1.85rem,3.2vw,3.75rem)]">
        Подбираем инструмент <span className="text-brand">под задачу</span>
      </h2>
      <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">
        Кредит, гарантия, факторинг, лизинг или проектное финансирование: от
        оборотки до сделок на миллиарды.
      </p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {SERVICES.map((s) => {
          const photo = PHOTOS[s.slug];
          return (
            <article
              key={s.slug}
              className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-soft)]"
            >
              <div className="relative aspect-[16/9] bg-brand-dark">
                {photo && (
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 1700px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <p className="text-sm text-muted">{s.segment}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink md:text-[1.35rem]">
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand-dark"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#lead"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
                >
                  Оставить заявку
                  <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
