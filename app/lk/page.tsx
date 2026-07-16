import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";
import LoginForm from "@/app/lk/login-form";
import { getApplications, type Application } from "@/lib/crm";

const fmt = (n: string) => new Intl.NumberFormat("ru-RU").format(Number(n));
const STEPS = ["Заявка принята", "В работе", "Подано в банк", "Решение банка"];

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

async function Cabinet({ email }: { email: string }) {
  const result = await getApplications(email);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <h1 className="text-2xl font-bold tracking-[-0.02em] md:text-3xl">Здравствуйте!</h1>
      <p className="mt-2 text-muted">
        Вы вошли как <span className="font-medium text-ink">{email}</span>.
        {result.ok && result.applications.length > 0 && " Статусы обновляются по мере работы."}
      </p>

      {result.ok && result.applications.length > 0 ? (
        <div className="mt-8 space-y-5">
          {result.applications.map((a) => (
            <ApplicationCard key={a.id} app={a} />
          ))}
        </div>
      ) : (
        <EmptyState result={result} />
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white/60 p-5 text-sm text-muted">
        Нужна ещё одна заявка?{" "}
        <Link href="/#lead" className="font-semibold text-brand underline underline-offset-2">
          Оформить новую
        </Link>
      </div>
    </div>
  );
}

// Пустой кабинет: разводим «заявок нет» и «CRM недоступна» — это разные ситуации
function EmptyState({ result }: { result: Awaited<ReturnType<typeof getApplications>> }) {
  const unreachable = !result.ok && result.reason === "unreachable";
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-black/15 bg-white/60 p-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-xl text-brand">
        {unreachable ? "⚠" : "⏳"}
      </div>
      <h2 className="mt-4 font-semibold tracking-tight">
        {unreachable ? "Не удалось загрузить заявки" : "Заявок пока нет"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        {unreachable
          ? "Попробуйте обновить страницу позже. Если не пройдёт — позвоните нам."
          : "Как только вы оставите заявку и мы начнём по ней работать, здесь появится её статус — от приёма до решения банка."}
      </p>
      <Link
        href="/#lead"
        className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Оставить заявку
      </Link>
    </div>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const tone = app.rejected ? "rejected" : app.done ? "approved" : "progress";
  return (
    <div className="rounded-2xl border border-black/[0.07] bg-white p-6 shadow-[var(--shadow-soft)] md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{app.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {app.amount ? `${fmt(app.amount)} ₽ · ` : ""}
            {app.company}
          </p>
        </div>
        <Badge label={app.status} tone={tone} />
      </div>

      <Tracker step={app.step} rejected={app.rejected} />

      <p className="mt-5 border-t border-black/5 pt-4 text-sm text-muted">
        Обновлено: {new Date(app.updatedAt).toLocaleDateString("ru-RU")}
      </p>
    </div>
  );
}

function Badge({ label, tone }: { label: string; tone: "progress" | "approved" | "rejected" }) {
  const styles = {
    progress: "bg-brand-soft text-brand-dark",
    approved: "bg-brand text-white",
    rejected: "bg-red-50 text-red-600",
  }[tone];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles}`}>{label}</span>;
}

function Tracker({ step, rejected }: { step: number; rejected: boolean }) {
  return (
    <div className="mt-6 flex items-center">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        // отказ красит текущий узел красным вместо зелёного
        const color = rejected && current ? "border-2 border-red-400 bg-white text-red-500" : "";
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                  color ||
                  (done
                    ? "bg-brand text-white"
                    : current
                    ? "border-2 border-brand bg-white text-brand"
                    : "border border-black/15 bg-white text-muted")
                }`}
              >
                {rejected && current ? "✕" : done ? "✓" : n}
              </div>
              <span
                className={`mt-2 w-24 text-center text-[11px] leading-tight ${
                  done || current ? "text-ink" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 ${n < step ? "bg-brand" : "bg-black/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
