import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

// Письмо со ссылкой для входа. Бренд KOVI: тёмный герой, жёлтая кнопка-акцент.
function loginEmailHtml(url: string): string {
  return `
  <div style="background:#08130e;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="460" cellpadding="0" cellspacing="0"
               style="max-width:460px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden">
          <tr><td style="background:#0e4634;padding:28px 32px">
            <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.02em">KOVI Finance</span>
          </td></tr>
          <tr><td style="padding:32px">
            <h1 style="margin:0 0 8px;font-size:22px;color:#08130e">Вход в личный кабинет</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5b6672">
              Нажмите кнопку, чтобы войти. Ссылка действует 15 минут и работает один раз.
            </p>
            <a href="${url}" style="display:inline-block;background:#1e7a57;color:#ffffff;
               text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px">
              Войти в кабинет
            </a>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#8a94a0">
              Если вы не запрашивали вход — просто проигнорируйте это письмо.
            </p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:12px;color:#5b6672">KOVI — от славянского «ковать»: мы выковываем финансовые решения.</p>
      </td></tr>
    </table>
  </div>`;
}

/**
 * Вход в личный кабинет по магик-линку (без пароля): человек вводит e-mail,
 * получает ссылку, переход по ней создаёт сессию. Владение почтой = доказательство.
 *
 * На локалке письма НЕ отправляются — ссылка печатается в консоль dev-сервера.
 * Реальную отправку (SMTP) подключим на этапе прода.
 */
const magicLink: Provider = {
  id: "email",
  type: "email",
  name: "Email",
  from: "no-reply@kovifinance.ru",
  maxAge: 15 * 60, // ссылка живёт 15 минут
  async sendVerificationRequest({ identifier, url }) {
    const subject = "Вход в личный кабинет KOVI Finance";
    const text = `Ссылка для входа (действует 15 минут):\n${url}`;

    // Первый приоритет — HTTP API Unisender Go.
    //
    // Почему не SMTP: из приложения на Timeweb исходящие подключения к
    // smtp.yandex.ru:465 и :587 висят до таймаута (~120 с) и обрываются, при этом
    // ни одного ответа SMTP-уровня — соединение не устанавливается вовсе.
    // HTTPS с того же контейнера работает штатно (проверено запросом к Checko),
    // поэтому отправка через обычный порт 443 обходит проблему целиком.
    // Сервис российский — адреса получателей, а это ПДн, не покидают РФ.
    if (process.env.UNISENDER_API_KEY) {
      const res = await fetch(
        "https://goapi.unisender.ru/ru/transactional/api/v1/email/send.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-KEY": process.env.UNISENDER_API_KEY,
          },
          body: JSON.stringify({
            message: {
              recipients: [{ email: identifier }],
              subject,
              body: { html: loginEmailHtml(url), plaintext: text },
              from_email: process.env.EMAIL_FROM ?? "info@kovifinance.ru",
              from_name: "KOVI Finance",
            },
          }),
        },
      );

      const data = await res.json().catch(() => null);
      // Сервис отвечает 200 и при отказе конкретному адресу, поэтому мало
      // проверить res.ok — нужен status в теле и пустой failed_emails.
      if (!res.ok || data?.status !== "success") {
        throw new Error(
          `Unisender Go не принял письмо (HTTP ${res.status}): ${JSON.stringify(data)}`,
        );
      }
      const failed = data.failed_emails ?? {};
      if (Object.keys(failed).length > 0) {
        throw new Error(`Unisender Go отклонил адрес: ${JSON.stringify(failed)}`);
      }
      return;
    }

    // Запасной путь: если ключа нет, а SMTP задан — шлём по SMTP.
    // Пригодится, когда Timeweb починит маршрут и захочется вернуться на Яндекс.
    if (process.env.SMTP_HOST) {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: Number(process.env.SMTP_PORT ?? 465) === 465, // 465 = SSL, 587 = STARTTLS
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });
      const info = await transport.sendMail({
        to: identifier,
        from: process.env.EMAIL_FROM ?? process.env.SMTP_USER,
        subject,
        text,
        html: loginEmailHtml(url),
      });
      // Для тестового ящика Ethereal — ссылка на просмотр письма; для реального SMTP = false
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log("\n📧 Просмотр письма (Ethereal):\n   " + preview + "\n");
      return;
    }
    console.log("\n🔑 Ссылка для входа в ЛК (" + identifier + "):\n   " + url + "\n");
  },
  options: {},
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [magicLink],
  session: { strategy: "database" }, // магик-линк требует сессий в БД
  pages: {
    signIn: "/lk",
    verifyRequest: "/lk?sent=1",
  },
});
