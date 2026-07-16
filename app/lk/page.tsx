import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import LoginForm from "@/app/lk/login-form";

export const metadata = { title: "Личный кабинет — KOVI Finance" };

// Вход по магик-линку без пароля. Не залогинен → форма входа; залогинен → кабинет.
export default async function CabinetPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const session = await auth();
  const { sent } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-black/5 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center" aria-label="KOVI Finance">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-primary.svg" alt="KOVI Finance" className="h-8 w-auto" />
          </Link>
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/lk" });
              }}
            >
              <button className="text-sm text-muted hover:text-ink">Выйти</button>
            </form>
          ) : (
            <Link href="/" className="text-sm text-muted hover:text-ink">
              ← На сайт
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 bg-paper-2/40">
        {session?.user ? (
          <Cabinet email={session.user.email ?? ""} />
        ) : (
          <div className="mx-auto flex max-w-md flex-col justify-center px-5 py-20">
            <div className="rounded-3xl border border-black/[0.07] bg-white p-8 shadow-[var(--shadow-soft)]">
              {sent ? (
                <div className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-2xl text-brand">
                    ✉
                  </div>
                  <h1 className="mt-5 text-2xl font-bold tracking-[-0.02em]">Проверьте почту</h1>
                  <p className="mt-2 text-sm text-muted">
                    Отправили ссылку для входа. Откройте письмо и перейдите по ней — пароль не
                    нужен.
                  </p>
                  <Link
                    href="/lk"
                    className="mt-6 inline-block text-sm text-brand underline underline-offset-2"
                  >
                    Ввести другой e-mail
                  </Link>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold tracking-[-0.02em]">Личный кабинет</h1>
                  <p className="mt-2 text-sm text-muted">
                    Введите e-mail, с которого оставляли заявку. Пришлём ссылку для входа —
                    пароль не нужен.
                  </p>
                  <LoginForm
                    action={async (email: string) => {
                      "use server";
                      await signIn("email", { email, redirectTo: "/lk" });
                    }}
                  />
                  <p className="mt-4 text-xs text-muted">
                    Ещё не оставляли заявку?{" "}
                    <Link href="/#lead" className="text-brand underline underline-offset-2">
                      Оставить заявку
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Cabinet({ email }: { email: string }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">Здравствуйте!</h1>
      <p className="mt-2 text-muted">
        Вы вошли как <span className="font-medium text-ink">{email}</span>.
      </p>

      {/* TODO (этап 2): вместо заглушки — статусы заявок этого e-mail из CRM Kovi
          по read-API. Сейчас база аккаунтов и вход работают, данные заявок ещё не
          подключены. */}
      <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white/60 p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-xl text-brand">
          ⏳
        </div>
        <h2 className="mt-4 font-semibold tracking-tight">Заявки скоро появятся здесь</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Как только подключим статусы из нашей системы, вы будете видеть здесь ход по каждой
          заявке — от приёма до решения банка.
        </p>
        <Link
          href="/#lead"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Оставить заявку
        </Link>
      </div>
    </div>
  );
}
