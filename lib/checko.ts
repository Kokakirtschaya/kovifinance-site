// Проверка ИНН через Checko API (только сервер — ключ не должен попасть в браузер).
// У Checko разные эндпоинты: /company — юрлица (10 цифр), /entrepreneur — ИП (12 цифр).
// Обычное физлицо без статуса ИП в реестрах не находится — это ожидаемо.
import { isValidInn, normalizeInn } from "@/lib/inn";

const BASE = (process.env.CHECKO_BASE_URL || "https://api.checko.ru/v2").replace(/\/$/, "");
const KEY = process.env.CHECKO_API_KEY || "";

export type InnKind = "org" | "ip"; // 10 цифр — юрлицо, 12 — ИП/физлицо

export type InnLookup =
  | { status: "invalid" } // не 10/12 цифр либо не сошлась контрольная сумма
  | { status: "unconfigured" } // нет ключа Checko — не блокируем
  | { status: "error" } // сеть/Checko недоступны — не блокируем
  | { status: "not_found"; kind: InnKind }
  | { status: "found"; kind: InnKind; name: string };

export async function lookupInn(rawInn: string): Promise<InnLookup> {
  const inn = normalizeInn(rawInn);
  if (!isValidInn(inn)) return { status: "invalid" };

  const kind: InnKind = inn.length === 10 ? "org" : "ip";
  if (!KEY) return { status: "unconfigured" };

  // 10 цифр — организация (ЕГРЮЛ), 12 — индивидуальный предприниматель (ЕГРИП).
  const endpoint = kind === "org" ? "company" : "entrepreneur";

  try {
    const url = `${BASE}/${endpoint}?key=${encodeURIComponent(KEY)}&inn=${inn}`;
    const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
    if (res.status === 404) return { status: "not_found", kind };
    if (!res.ok) return { status: "error" };

    const json = await res.json();
    const data = json?.data ?? json;
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return { status: "not_found", kind };
    }

    // Юрлицо — НаимСокр/НаимПолн; ИП — ФИО (добавляем префикс «ИП»).
    const name =
      kind === "ip"
        ? `ИП ${String(data.ФИО || "").trim()}`.trim()
        : String(data.НаимСокр || data.НаимПолн || "").trim();
    return { status: "found", kind, name };
  } catch {
    return { status: "error" };
  }
}
