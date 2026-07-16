import { NextResponse } from "next/server";
import { createLead } from "@/lib/crm";

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

  // Заголовок заявки: продукт с главной, либо тип объекта/залога с посадочных
  const title =
    (body.product ?? "").trim() ||
    (body.property ?? "").trim() ||
    (body.pledge ?? "").trim() ||
    "не указано";
  // Сумма: price/sum с посадочных страниц
  const amount = String(body.price ?? body.sum ?? "").trim();
  const source = (body.source ?? "").trim();

  const lead = { name, phone, email, inn: (body.inn ?? "").trim(), title, amount, source };

  // 1) В CRM — создаёт сделку (клиент увидит её в ЛК, если указал e-mail)
  const crm = await createLead({
    name,
    phone,
    email: email || undefined,
    inn: lead.inn || undefined,
    title,
    amount: amount || undefined,
    source: source || undefined,
  });

  // 2) В Telegram — быстрое уведомление менеджеру (дублирует, не заменяет CRM)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const text =
      `🟢 Новая заявка с сайта${source ? ` (${source})` : ""}\n\n` +
      `👤 ${name}\n📞 ${phone}\n` +
      (email ? `✉️ ${email}\n` : "") +
      (lead.inn ? `🏢 ИНН: ${lead.inn}\n` : "") +
      `💼 ${title}` +
      (amount ? `\n💰 ${amount}` : "") +
      `\n\n${crm.ok ? "✅ в CRM" : "⚠️ CRM недоступна — занести вручную"}`;
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
    } catch (err) {
      console.error("telegram notify failed", err);
    }
  } else {
    console.log("LEAD", JSON.stringify({ ...lead, crm: crm.ok }));
  }

  return NextResponse.json({ ok: true });
}
