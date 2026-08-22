import { NextResponse } from "next/server";
import { lookupInn } from "@/lib/checko";
import { clientIpFromHeaders, FIFTEEN_MIN, rateLimit } from "@/lib/rate-limit";

// Живая проверка ИНН из формы (вызывается на blur). Ключ Checko остаётся на сервере.
export async function GET(request: Request) {
  const ip = clientIpFromHeaders(request.headers);
  if (!rateLimit(`inn:ip:${ip}`, 40, FIFTEEN_MIN)) {
    return NextResponse.json({ status: "error" }, { status: 429 });
  }
  const inn = new URL(request.url).searchParams.get("inn") ?? "";
  const result = await lookupInn(inn);
  return NextResponse.json(result);
}
