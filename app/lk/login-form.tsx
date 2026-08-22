"use client";

import { useState, useTransition } from "react";

// Форма ввода e-mail. Сам вход (signIn) — на сервере, сюда приходит action.
export default function LoginForm({
  action,
}: {
  action: (email: string) => Promise<{ error?: string }>;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            const result = await action(email);
            if (result?.error) setError(result.error);
          } catch (e) {
            const digest =
              typeof e === "object" && e && "digest" in e
                ? String((e as { digest?: string }).digest)
                : "";
            if (digest.includes("NEXT_REDIRECT")) throw e;
            setError("Не получилось отправить письмо. Попробуйте ещё раз.");
          }
        });
      }}
      className="mt-6 space-y-3"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.ru"
        className="w-full rounded-xl border border-black/10 bg-paper px-4 py-3 text-sm outline-none focus:border-brand"
      />
      <button
        disabled={pending}
        className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Отправляем…" : "Получить ссылку для входа"}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
