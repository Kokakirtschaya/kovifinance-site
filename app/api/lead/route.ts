import { NextResponse } from "next/server";

type Lead = {
  name?: string;
  phone?: string;
  inn?: string;
  product?: string;
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

  if (!name || phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    inn: (body.inn ?? "").trim(),
    product: (body.product ?? "").trim() || "не указано",
  };

  // Уведомление в Telegram (если заданы переменные окружения)
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    const text =
      `🟢 Новая заявка с сайта\n\n` +
      `👤 ${lead.name}\n` +
      `📞 ${lead.phone}\n` +
      `🏢 ИНН: ${lead.inn || "—"}\n` +
      `💼 Продукт: ${lead.product}`;
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
    // fallback: заявка попадёт в логи Vercel
    console.log("LEAD", JSON.stringify(lead));
  }

  return NextResponse.json({ ok: true });
}
