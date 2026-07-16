"use client";

import { useState, useTransition } from "react";

// Форма ввода e-mail. Сам вход (signIn) — на сервере, сюда приходит action.
export default function LoginForm({ action }: { action: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => action(email));
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
    </form>
  );
}
