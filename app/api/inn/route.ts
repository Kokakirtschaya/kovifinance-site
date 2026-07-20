import { NextResponse } from "next/server";
import { lookupInn } from "@/lib/checko";

// Живая проверка ИНН из формы (вызывается на blur). Ключ Checko остаётся на сервере.
export async function GET(request: Request) {
  const inn = new URL(request.url).searchParams.get("inn") ?? "";
  const result = await lookupInn(inn);
  return NextResponse.json(result);
}
