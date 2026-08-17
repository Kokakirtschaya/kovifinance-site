// Связь личного кабинета с CRM Kovi: статусы заявок клиента по e-mail.
// Вызывается только на сервере (токен не должен попасть в браузер).
// Боевой адрес CRM — только crm.kovifinance.ru. Старый crm.koka-net.ru
// в переменных ещё может встретиться, его подменяем.

export const CRM_PUBLIC_URL = "https://crm.kovifinance.ru";

export function crmApiBase(): string | undefined {
  const raw = process.env.CRM_API_URL?.trim();
  if (!raw) return undefined;
  if (/crm\.koka-net\.ru/i.test(raw)) return CRM_PUBLIC_URL;
  return raw.replace(/\/$/, "");
}

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

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  inn?: string;
  company?: string; // название из Checko по ИНН, если найдено
  title?: string; // продукт/услуга
  amount?: string;
  source?: string; // с какой страницы
};

// Отправка заявки в CRM (создаёт сделку). Не критично: если CRM недоступна,
// заявка всё равно уходит в Telegram — вызывающий не должен падать.
export async function createLead(lead: LeadInput): Promise<{ ok: boolean }> {
  const base = crmApiBase();
  const token = process.env.CRM_API_TOKEN;
  if (!base || !token) return { ok: false };

  try {
    const res = await fetch(`${base}/api/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(lead),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

export async function getApplications(email: string): Promise<CrmResult> {
  const base = crmApiBase();
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
