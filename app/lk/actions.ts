"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LOGIN_UNAVAILABLE, loginErrorMessage } from "@/lib/auth-messages";

export async function requestMagicLink(
  email: string,
  pdConsent?: boolean,
): Promise<{ error?: string }> {
  if (!pdConsent) {
    return { error: "Отметьте согласие на обработку персональных данных." };
  }
  const trimmed = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!trimmed || !trimmed.includes("@")) {
    return { error: "Укажите рабочую почту" };
  }
  let destination: string;
  try {
    // Общий лимит применяется внутри Auth.js. Отказ показываем в этой же
    // форме, сохраняя введённый адрес; успешную отправку завершаем переходом.
    destination = await signIn("email", { email: trimmed, redirectTo: "/lk", redirect: false });
  } catch (error) {
    if (error instanceof AuthError) return { error: LOGIN_UNAVAILABLE };
    throw error;
  }
  const message = loginErrorMessage(new URL(destination).searchParams.get("error"));
  if (message) return { error: message };
  redirect(destination);
}
