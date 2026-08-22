"use server";

import { headers } from "next/headers";
import { signIn } from "@/auth";
import { clientIpFromHeaders, FIFTEEN_MIN, rateLimit } from "@/lib/rate-limit";

export async function requestMagicLink(email: string): Promise<{ error?: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !trimmed.includes("@")) {
    return { error: "Укажите рабочую почту" };
  }
  const ip = clientIpFromHeaders(await headers());
  if (
    !rateLimit(`lk:ip:${ip}`, 5, FIFTEEN_MIN) ||
    !rateLimit(`lk:mail:${trimmed}`, 3, FIFTEEN_MIN)
  ) {
    return { error: "Слишком много попыток. Подождите несколько минут." };
  }
  await signIn("email", { email: trimmed, redirectTo: "/lk" });
  return {};
}
