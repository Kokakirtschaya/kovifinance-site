import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createLead } from "@/lib/crm";
import { lookupInn } from "@/lib/checko";
import { notifyTelegram } from "@/lib/notify";
import { clientIpFromHeaders, FIFTEEN_MIN, rateLimit } from "@/lib/rate-limit";
import { validateLead } from "@/lib/lead-validation";
import { createLeadConsent } from "@/lib/pd-consent";

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!rateLimit(`lead:ip:${ip}`, 8, FIFTEEN_MIN)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const validation = validateLead(input);
  if (!validation.ok) {
    return NextResponse.json(validation, { status: 422 });
  }
  const body = validation.lead;
  const { name, phone, email, inn: innRaw } = body;
  const requestId = randomUUID();
  const consent = createLeadConsent(requestId);

  // ИНН обязателен: проверяем формат/контрольную сумму и существование в Checko.
  // Блокируем только явные фейки: юрлицо (10 цифр), которого нет в ЕГРЮЛ.
  // 12-значный не найден — возможно физлицо без ИП, пропускаем с пометкой.
  const innCheck = await lookupInn(innRaw);
  if (innCheck.status === "invalid") {
    return NextResponse.json({ ok: false, error: "inn_invalid" }, { status: 422 });
  }
  if (innCheck.status === "not_found" && innCheck.kind === "org") {
    return NextResponse.json({ ok: false, error: "inn_not_found" }, { status: 422 });
  }
  const company = innCheck.status === "found" ? innCheck.name : "";

  // Заголовок заявки: продукт с главной, либо тип объекта/залога с посадочных
  const title =
    body.product ||
    body.property ||
    body.pledge ||
    "не указано";
  // Сумма: price/sum с посадочных страниц
  const amount = body.price || body.sum;
  const source = body.source;

  // 1) В CRM — создаёт сделку (клиент увидит её в ЛК, если указал e-mail)
  const crm = await createLead({
    name,
    phone,
    email: email || undefined,
    inn: innRaw || undefined,
    company: company || undefined,
    title,
    amount: amount || undefined,
    source: source || undefined,
    consent,
  });

  // 2) В Telegram передаём только технический номер и идентификаторы CRM.
  // Данные заявки отправляются только в CRM.
  const notified = await notifyTelegram({
    requestId,
    savedToCrm: crm.ok,
    dealId: crm.ok ? crm.dealId : undefined,
    companyId: crm.ok ? crm.companyId : undefined,
  });

  // Только технический результат: контакты и произвольные поля в логи не попадают.
  console.log(
    "LEAD",
    JSON.stringify({
      requestId,
      crm: crm.ok,
      dealId: crm.ok ? crm.dealId : undefined,
      tg: notified.ok,
    }),
  );

  // Уведомление без контактов не заменяет сохранённую заявку. Если CRM
  // не подтвердила приём, форма сохраняет данные и предлагает повторить отправку.
  if (!crm.ok) {
    return NextResponse.json(
      { ok: false, error: "delivery_failed", requestId },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, requestId });
}
