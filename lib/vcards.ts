import { CONTACTS } from "@/lib/site";
import { PHOTO as KOKA_PHOTO } from "@/lib/vcard-photos/koka";

// Цифровые визитки /v/<slug>: QR на печатной визитке ведёт на страницу,
// кнопка «Сохранить контакт» отдаёт .vcf с фото. Фото в сам QR не помещается.

export type Phone = { label: string; value: string; type: "CELL" | "WORK" };
export type Link = { label: string; href: string };

export type VCard = {
  givenName: string;
  familyName: string;
  organization?: string;
  title?: string;
  phones: Phone[];
  email?: string;
  site?: string;
  links: Link[];
  photoUrl: string; // для страницы
  photoBase64: string; // JPEG для .vcf
};

export const VCARDS: Record<string, VCard> = {
  koka: {
    givenName: "Кока",
    familyName: "Кирцхая",
    organization: "KOVIFinance",
    phones: [
      { label: "Мобильный", value: "+79060554884", type: "CELL" },
      { label: "Рабочий", value: "+74996476006", type: "WORK" },
    ],
    email: CONTACTS.email,
    site: "https://kovifinance.ru",
    links: [
      { label: "Telegram", href: CONTACTS.telegram },
      { label: "YouTube", href: CONTACTS.youtube },
      { label: "Instagram", href: CONTACTS.instagram },
    ],
    photoUrl: "/vcard/koka.jpg",
    photoBase64: KOKA_PHOTO,
  },
};

export function fullName(c: VCard) {
  return `${c.givenName} ${c.familyName}`;
}

// +74996476006 → +7 499 647-60-06
export function formatPhone(v: string) {
  const m = v.match(/^\+7(\d{3})(\d{3})(\d{2})(\d{2})$/);
  return m ? `+7 ${m[1]} ${m[2]}-${m[3]}-${m[4]}` : v;
}

function escape(v: string) {
  return v.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

// RFC 2426: строка не длиннее 75 октетов, продолжение начинается с пробела.
// Режем по байтам UTF-8, не разрывая символ.
function fold(line: string) {
  const out: string[] = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const n = Buffer.byteLength(ch);
    const limit = out.length === 0 ? 75 : 74;
    if (bytes + n > limit) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += n;
  }
  out.push(cur);
  return out.join("\r\n ");
}

export function toVcf(c: VCard) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(c.familyName)};${escape(c.givenName)};;;`,
    `FN:${escape(fullName(c))}`,
  ];
  if (c.organization) lines.push(`ORG:${escape(c.organization)}`);
  if (c.title) lines.push(`TITLE:${escape(c.title)}`);
  for (const p of c.phones) lines.push(`TEL;TYPE=${p.type},VOICE:${p.value}`);
  if (c.email) lines.push(`EMAIL;TYPE=INTERNET,WORK:${c.email}`);
  if (c.site) lines.push(`URL;TYPE=WORK:${c.site}`);
  // itemN + X-ABLabel — подписи ссылок в контактах iPhone; Android берёт только URL.
  c.links.forEach((l, i) => {
    lines.push(`item${i + 1}.URL:${l.href}`, `item${i + 1}.X-ABLabel:${l.label}`);
  });
  lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${c.photoBase64}`, "END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}
