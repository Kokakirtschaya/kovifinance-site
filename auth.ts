import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Provider } from "next-auth/providers";
import { prisma } from "@/lib/prisma";

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
    if (process.env.SMTP_HOST) {
      // TODO: прод — реальная отправка письма через SMTP
      throw new Error("SMTP sending not implemented yet");
    }
    // dev: ссылка в консоль
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
