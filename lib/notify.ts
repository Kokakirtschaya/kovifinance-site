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

const RELAY_TIMEOUT_MS = 9000;
const DIRECT_TIMEOUT_MS = 5000;

export type NotifyResult =
  | { ok: true; via: "relay" | "direct" }
  | { ok: false; reason: string };

async function viaRelay(text: string): Promise<NotifyResult> {
  const base = process.env.CRM_API_URL;
  const token = process.env.CRM_API_TOKEN;
  if (!base || !token) return { ok: false, reason: "relay_unconfigured" };

  try {
    const res = await fetch(`${base}/api/public/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(RELAY_TIMEOUT_MS),
    });
    if (res.ok) return { ok: true, via: "relay" };
    return { ok: false, reason: `relay_http_${res.status}` };
  } catch (err) {
    return { ok: false, reason: `relay_unreachable: ${String(err)}` };
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
    if (res.ok) return { ok: true, via: "direct" };
    return { ok: false, reason: `direct_http_${res.status}` };
  } catch (err) {
    return { ok: false, reason: `direct_unreachable: ${String(err)}` };
  }
}

/**
 * Шлёт текст менеджеру. Никогда не бросает исключение — заявка важнее уведомления.
 *
 * Если не доставлено, пишет в лог строку TELEGRAM_FAILED вместе с полным текстом:
 * по ней сбой видно поиском в «Логах приложения», а саму заявку можно достать
 * оттуда руками. Раньше ошибка гасилась молча, и о поломке узнали только через
 * четыре дня — теперь молчания быть не должно.
 */
export async function notifyTelegram(text: string): Promise<NotifyResult> {
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
    "| текст:",
    text,
  );
  return { ok: false, reason: `${relay.reason}; ${direct.reason}` };
}
