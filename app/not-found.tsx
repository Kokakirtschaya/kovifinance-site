import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center text-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-inverse.svg" alt="KOVI Finance" className="h-9 w-auto" />
      <p className="mt-10 text-7xl font-bold tracking-[-0.02em] text-gold-bright">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-[-0.02em] md:text-3xl">
        Страница не найдена
      </h1>
      <p className="mt-3 max-w-sm text-white/60">
        Возможно, ссылка устарела или страница была перемещена.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        На главную
      </Link>
    </div>
  );
}
