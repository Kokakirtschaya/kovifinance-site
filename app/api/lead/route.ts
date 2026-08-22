import { NextResponse } from "next/server";
import { createLead } from "@/lib/crm";
import { lookupInn } from "@/lib/checko";
import { notifyTelegram } from "@/lib/notify";
import { clientIpFromHeaders, FIFTEEN_MIN, rateLimit } from "@/lib/rate-limit";

type Lead = {
  name?: string;
  phone?: string;
  email?: string;
  inn?: string;
  product?: string;
  // с посадочных страниц приходят свои поля
  property?: string;
  pledge?: string;
  price?: string;
  city?: string;
  sum?: string | number;
  source?: string;
};

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!rateLimit(`lead:ip:${ip}`, 8, FIFTEEN_MIN)) {
    return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  }

  let body: Lead;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();

  if (!name || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // ИНН обязателен: проверяем формат/контрольную сумму и существование в Checko.
  // Блокируем только явные фейки: юрлицо (10 цифр), которого нет в ЕГРЮЛ.
  // 12-значный не найден — возможно физлицо без ИП, пропускаем с пометкой.
  const innRaw = (body.inn ?? "").trim();
  const innCheck = await lookupInn(innRaw);
  if (innCheck.status === "invalid") {
    return NextResponse.json({ ok: false, error: "inn_invalid" }, { status: 422 });
  }
  if (innCheck.status === "not_found" && innCheck.kind === "org") {
    return NextResponse.json({ ok: false, error: "inn_not_found" }, { status: 422 });
  }
  const company = innCheck.status === "found" ? innCheck.name : "";
  const innNotInRegistry = innCheck.status === "not_found";

  // Заголовок заявки: продукт с главной, либо тип объекта/залога с посадочных
  const title =
    (body.product ?? "").trim() ||
    (body.property ?? "").trim() ||
    (body.pledge ?? "").trim() ||
    "не указано";
  // Сумма: price/sum с посадочных страниц
  const amount = String(body.price ?? body.sum ?? "").trim();
  const source = (body.source ?? "").trim();

  const lead = { name, phone, email, inn: innRaw, company, title, amount, source };

  // 1) В CRM — создаёт сделку (клиент увидит её в ЛК, если указал e-mail)
  const crm = await createLead({
    name,
    phone,
    email: email || undefined,
    inn: lead.inn || undefined,
    company: company || undefined,
    title,
    amount: amount || undefined,
    source: source || undefined,
  });

  // 2) В Telegram — быстрое уведомление менеджеру (дублирует, не заменяет CRM).
  // Идёт релеем через сервер CRM: напрямую из контейнера Telegram недостижим —
  // подробности в lib/notify.ts.
  const text =
    `🟢 Новая заявка с сайта${source ? ` (${source})` : ""}\n\n` +
    `👤 ${name}\n📞 ${phone}\n` +
    (email ? `✉️ ${email}\n` : "") +
    (lead.inn
      ? `🏢 ИНН: ${lead.inn}` +
        (company ? ` — ${company}` : innNotInRegistry ? " — ⚠️ в реестре не найден" : "") +
        "\n"
      : "") +
    `💼 ${title}` +
    (amount ? `\n💰 ${amount}` : "") +
    `\n\n${crm.ok ? "✅ в CRM" : "⚠️ CRM недоступна — занести вручную"}`;

  const notified = await notifyTelegram(text);

  // В лог — без телефона и почты. Если не дошло ни в CRM, ни в TG — заявка
  // всё равно у менеджера в форме/звонке, а логи Timeweb не копия анкеты.
  console.log(
    "LEAD",
    JSON.stringify({
      inn: lead.inn ? `***${lead.inn.slice(-4)}` : "",
      title,
      source,
      crm: crm.ok,
      tg: notified.ok,
    }),
  );

  return NextResponse.json({ ok: true });
}
