// Связь личного кабинета с CRM Kovi: статусы заявок клиента по e-mail.
// Вызывается только на сервере (токен не должен попасть в браузер).

export type Application = {
  id: string;
  title: string;
  company: string;
  amount: string | null;
  status: string;
  step: number; // 1..4 — узел трекера
  done: boolean; // одобрено
  rejected: boolean; // отказ
  updatedAt: string;
};

export type CrmResult =
  | { ok: true; applications: Application[] }
  | { ok: false; reason: "unconfigured" | "unreachable" };

export async function getApplications(email: string): Promise<CrmResult> {
  const base = process.env.CRM_API_URL;
  const token = process.env.CRM_API_TOKEN;
  // Пока CRM не подключена (нет env) — кабинет показывает мягкую заглушку, не ошибку
  if (!base || !token) return { ok: false, reason: "unconfigured" };

  try {
    const res = await fetch(
      `${base}/api/public/applications?email=${encodeURIComponent(email)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", // статусы должны быть свежими
      },
    );
    if (!res.ok) return { ok: false, reason: "unreachable" };
    const data = (await res.json()) as { applications: Application[] };
    return { ok: true, applications: data.applications ?? [] };
  } catch {
    // CRM недоступна (выключена, сеть) — не роняем кабинет
    return { ok: false, reason: "unreachable" };
  }
}
