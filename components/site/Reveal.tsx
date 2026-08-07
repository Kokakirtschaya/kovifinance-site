/**
 * Появление блока при прокрутке — БЕЗ JavaScript.
 *
 * История вопроса: сначала здесь был whileInView из motion, потом свой
 * IntersectionObserver — и то и другое ломалось одинаково. Safari замораживает
 * неактивную вкладку целиком: React, таймеры и наблюдатели встают. Контент,
 * спрятанный до сигнала от JS, оставался невидимым — страница белая, пока не
 * подвигаешь мышью.
 *
 * Теперь анимация живёт в CSS (globals.css, [data-reveal]) и управляется
 * прокруткой через animation-timeline: view(). Замораживать нечего: если
 * браузер не умеет scroll-driven анимации, правило игнорируется и блок просто
 * проявляется при загрузке — видимый в любом случае.
 *
 * Серверный компонент: клиентского кода здесь больше нет.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={className}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
