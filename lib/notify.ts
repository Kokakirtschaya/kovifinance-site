// Уведомление менеджеру в Telegram. Только сервер — токены в браузер не попадают.
//
// ⚠️ Прямая отправка с прода НЕ работает: контейнер Timeweb App Platform не достаёт
// до api.telegram.org — соединение висит и отваливается по таймауту (10.08.2026).
// Провайдер тут ни при чём: с сервера CRM (тот же Timeweb, та же Москва) Telegram
// отвечает за 50 мс. Поэтому основной путь — релей через CRM, а прямая отправка
// осталась запасной: ею пользуется локальная разработка, где CRM обычно не поднята.
//
// Порядок именно такой (сначала релей): пробовать заблокированный путь первым —
// это лишние секунды ожидания на каждой заявке.

import { crmApiBase } from "@/lib/crm";

const RELAY_TIMEOUT_MS = 9000;
const DIRECT_TIMEOUT_MS = 5000;

export type NotifyResult =
  | { ok: true; via: "relay" | "direct" }
  | { ok: false; reason: string };

async function viaRelay(text: string): Promise<NotifyResult> {
  const base = crmApiBase();
  const token = process.env.CRM_API_TOKEN;
  if (!base || !token) return { ok: false, reason: "relay_unconfigured" };

  try {
    const res = await fetch(`${base}/api/public/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, reason: `relay_http_${res.status}` };
    const data = await res.json();
    return data?.ok === true
      ? { ok: true, via: "relay" }
      : { ok: false, reason: "relay_unconfirmed" };
  } catch {
    return { ok: false, reason: "relay_unreachable" };
  }
}

async function viaDirect(text: string): Promise<NotifyResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: "direct_unconfigured" };

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(DIRECT_TIMEOUT_MS),
    });
    if (!res.ok) return { ok: false, reason: `direct_http_${res.status}` };
    const data = await res.json();
    return data?.ok === true
      ? { ok: true, via: "direct" }
      : { ok: false, reason: "direct_unconfirmed" };
  } catch {
    return { ok: false, reason: "direct_unreachable" };
  }
}

/**
 * Шлёт текст менеджеру. Никогда не бросает исключение — заявка важнее уведомления.
 *
 * При сбое пишет TELEGRAM_FAILED с номером обращения и причинами отказа.
 * Сам текст заявки с контактами в журнал приложения не попадает.
 */
export async function notifyTelegram(text: string, requestId?: string): Promise<NotifyResult> {
  const relay = await viaRelay(text);
  if (relay.ok) return relay;

  const direct = await viaDirect(text);
  if (direct.ok) {
    console.warn("TELEGRAM: релей не сработал, ушло напрямую |", relay.reason);
    return direct;
  }

  console.error(
    "TELEGRAM_FAILED: уведомление не доставлено ни релеем, ни напрямую.",
    `relay=${relay.reason}`,
    `direct=${direct.reason}`,
    `requestId=${requestId ?? "unknown"}`,
  );
  return { ok: false, reason: `${relay.reason}; ${direct.reason}` };
}
