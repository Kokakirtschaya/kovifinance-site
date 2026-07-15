import Image from "next/image";
import { TEAM } from "@/lib/site";
import Reveal from "@/components/site/Reveal";

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-20 md:py-28">
      {/* Фон секции. object-cover, а не растяжение: картинка заполняет ширину при любом
          зуме и обрезается по краям, сохраняя пропорции. */}
      <Image
        src="/team/office.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Вуаль градиентом: плотная сверху, где заголовок, и почти прозрачная внизу,
          где карточки — там читаемость держит их собственное матовое стекло.
          Так фото открыто сильнее, чем под сплошной заливкой. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/55 to-ink/10" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-5xl">
            С вами работают <span className="text-gold-bright">практики рынка</span>
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Бывшие банкиры и финансовые аналитики. Знаем требования банков изнутри —
            поэтому получаем одобрения там, где отказывают другим.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={i} delay={i * 0.06} className="h-full">
            {/* Матовое стекло: полупрозрачен ФОН карточки (bg-white/85), а не она целиком.
                opacity красит насквозь всё содержимое — от него сотрудники и текст
                становились призрачными. backdrop-blur размывает офис под карточкой,
                поэтому тёмный текст лежит на почти ровном светлом. */}
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/85 shadow-[var(--shadow-lift)] backdrop-blur-md">
              {/* Фото с прозрачным фоном — подложки нет, проступает сама карточка.
                  object-bottom: фигуры на всех кадрах упираются в нижний край,
                  поэтому по нему они и выравниваются между собой. */}
              <div className="relative h-56 shrink-0">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-contain object-bottom"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold tracking-tight">{m.name}</h3>
                <p className="mt-1 text-sm text-brand-dark">{m.role}</p>
                <p className="mt-3 text-sm text-muted">{m.note}</p>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
