import Link from "next/link";

function UserIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.6 20c1.4-3.6 4.1-5.4 7.4-5.4s6 1.8 7.4 5.4" />
    </svg>
  );
}

/**
 * Вход в личный кабинет.
 * «text» — с подписью (вторая строка шапки, где есть место, и мобильное меню),
 * «icon» — только знак: на 1024–1280 вторая строка скрыта, а подпись рядом
 * с телефоном и кнопкой заявки не помещается.
 */
export default function CabinetLink({
  variant = "text",
  className = "",
  onClick,
}: {
  variant?: "text" | "icon" | "menu";
  className?: string;
  onClick?: () => void;
}) {
  const common =
    "group inline-flex items-center justify-center border border-brand/20 bg-brand-soft/60 text-brand-dark transition-colors hover:border-brand hover:bg-brand hover:text-white";

  if (variant === "icon") {
    return (
      <Link
        href="/lk"
        onClick={onClick}
        aria-label="Личный кабинет"
        title="Личный кабинет"
        className={`${common} h-10 w-10 shrink-0 rounded-full ${className}`}
      >
        <UserIcon size={20} />
      </Link>
    );
  }

  if (variant === "menu") {
    return (
      <Link
        href="/lk"
        onClick={onClick}
        className={`${common} gap-3 rounded-2xl px-4 py-3 text-left ${className}`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/70 text-brand transition-colors group-hover:bg-white/15 group-hover:text-white">
          <UserIcon size={18} />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Личный кабинет</span>
          <span className="block text-xs text-muted transition-colors group-hover:text-white/70">
            Статус вашей заявки
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/lk"
      onClick={onClick}
      className={`${common} gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium ${className}`}
    >
      <UserIcon size={16} />
      Личный кабинет
    </Link>
  );
}
