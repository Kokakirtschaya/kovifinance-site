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

import { CRM_PUBLIC_URL, crmApiBase, crmRecordId } from "@/lib/crm";

const RELAY_TIMEOUT_MS = 9000;
const DIRECT_TIMEOUT_MS = 5000;

export type NotifyResult =
  | { ok: true; via: "relay" | "direct" }
  | { ok: false; reason: string };

export type LeadNotification = {
  requestId: string;
  savedToCrm: boolean;
  dealId?: string;
  companyId?: string;
};

/** Только номер и защищённая ссылка: свободного текста из заявки здесь нет. */
export function formatLeadNotification(notice: LeadNotification): string | undefined {
  if (
    !notice ||
    typeof notice.requestId !== "string" ||
    !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(notice.requestId) ||
    typeof notice.savedToCrm !== "boolean"
  ) {
    return undefined;
  }

  if (!notice.savedToCrm) {
    return "⚠️ CRM не подтвердила сохранение заявки\n\n" +
      `Номер обращения: ${notice.requestId}\n` +
      "Пользователю предложено повторить отправку.\n" +
      `Открыть CRM: ${CRM_PUBLIC_URL}/deals`;
  }

  const dealId = crmRecordId(notice.dealId);
  const companyId = crmRecordId(notice.companyId);
  // В CRM сделки открываются внутри карточки клиента. Отдельного маршрута
  // /deals/:id нет. При старом ответе без ID ведём в список сделок.
  const url = companyId
    ? `${CRM_PUBLIC_URL}/companies/${companyId}`
    : `${CRM_PUBLIC_URL}/deals`;
  return "🟢 Новая заявка с сайта\n\n" +
    `Номер заявки: ${dealId ?? notice.requestId}\n` +
    `Открыть в CRM: ${url}`;
}

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
 * Свободный текст и контакты не принимаются: оба транспорта получают одну
 * строку, собранную только из разрешённых технических полей.
 */
export async function notifyTelegram(notice: LeadNotification): Promise<NotifyResult> {
  const text = formatLeadNotification(notice);
  if (!text) return { ok: false, reason: "invalid_notification" };
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
    `requestId=${notice.requestId}`,
  );
  return { ok: false, reason: `${relay.reason}; ${direct.reason}` };
}
