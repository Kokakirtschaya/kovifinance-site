import { isValidInn } from "@/lib/inn";
import { SERVICES } from "@/lib/site";
import { PD_CONSENT } from "@/lib/pd-consent";

export const LEAD_LIMITS = {
  name: 120,
  phone: 40,
  email: 254,
  inn: 12,
  product: 120,
  property: 120,
  pledge: 120,
  price: 80,
  city: 120,
  source: 200,
} as const;

type TextField = keyof typeof LEAD_LIMITS;
type LeadFields = Record<TextField, string> & { sum: string };

type LeadValidation =
  | { ok: true; lead: LeadFields }
  | { ok: false; error: "validation" | "inn_invalid" | "consent" | "consent_version"; field?: TextField | "sum" | "pdConsent" | "pdConsentVersion" };

function isConsentGiven(value: unknown): boolean {
  return value === true || value === "true" || value === "on" || value === "1";
}

const PRODUCTS = new Set([...SERVICES.map((service) => service.title), "Другое"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Поля заявки однострочные; управляющие символы не должны менять текст уведомления.
const HAS_CONTROL_CHARS = /[\p{Cc}\p{Cf}]/u;

/** Проверяем HTTP-данные до обращений к внешним сервисам. */
export function validateLead(body: unknown): LeadValidation {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "validation" };
  }

  const input = body as Record<string, unknown>;
  const lead = {} as LeadFields;
  for (const field of Object.keys(LEAD_LIMITS) as TextField[]) {
    const raw = input[field];
    // Необязательные отсутствующие поля допустимы, но числа/массивы/объекты — нет.
    if (raw === undefined) {
      lead[field] = "";
      continue;
    }
    if (
      typeof raw !== "string" ||
      raw.length > LEAD_LIMITS[field] ||
      HAS_CONTROL_CHARS.test(raw)
    ) {
      return { ok: false, error: "validation", field };
    }
    lead[field] = raw.trim();
  }

  if (!lead.name) return { ok: false, error: "validation", field: "name" };

  const phoneDigits = lead.phone.replace(/\D/g, "");
  if (
    !/^\+?[\d ()-]+$/.test(lead.phone) ||
    !/^(?:[78])?[3-9]\d{9}$/.test(phoneDigits)
  ) {
    return { ok: false, error: "validation", field: "phone" };
  }
  lead.phone = `+7${phoneDigits.slice(-10)}`;

  if (lead.email && !EMAIL_RE.test(lead.email)) {
    return { ok: false, error: "validation", field: "email" };
  }
  // Никакого усечения или удаления букв: проверяется именно присланный ИНН.
  if (!isValidInn(lead.inn)) {
    return { ok: false, error: "inn_invalid", field: "inn" };
  }
  if (lead.product && !PRODUCTS.has(lead.product)) {
    return { ok: false, error: "validation", field: "product" };
  }
  if (!isConsentGiven(input.pdConsent)) {
    return { ok: false, error: "consent", field: "pdConsent" };
  }
  if (input.pdConsentVersion !== PD_CONSENT.version) {
    return { ok: false, error: "consent_version", field: "pdConsentVersion" };
  }

  const sum = input.sum;
  if (sum === undefined) {
    lead.sum = "";
  } else if (typeof sum === "number" && Number.isSafeInteger(sum) && sum >= 0) {
    lead.sum = String(sum);
  } else if (
    typeof sum === "string" &&
    sum.length <= LEAD_LIMITS.price &&
    !HAS_CONTROL_CHARS.test(sum)
  ) {
    lead.sum = sum.trim();
  } else {
    return { ok: false, error: "validation", field: "sum" };
  }

  return { ok: true, lead };
}
