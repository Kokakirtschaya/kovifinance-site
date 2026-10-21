import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VCARDS, formatPhone, fullName } from "@/lib/vcards";

// Страница цифровой визитки: на неё ведёт QR. Не индексируем — это не страница сайта.

export function generateStaticParams() {
  return Object.keys(VCARDS).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/v/[slug]">): Promise<Metadata> {
  const card = VCARDS[(await params).slug];
  if (!card) return {};
  return {
    title: `${fullName(card)} — визитка`,
    description: `Контакты: ${fullName(card)}, ${card.organization ?? "KOVIFinance"}.`,
    robots: { index: false, follow: false },
  };
}

const row =
  "flex min-h-14 items-center justify-between gap-4 rounded-xl bg-white px-5 shadow-soft transition-colors hover:bg-brand-soft";

export default async function VCardPage({ params }: PageProps<"/v/[slug]">) {
  const { slug } = await params;
  const card = VCARDS[slug];
  if (!card) notFound();

  return (
    <main className="flex-1 bg-paper-2">
      <div className="mx-auto max-w-md px-4 pb-12">
        <div className="-mx-4 bg-brand-dark px-4 pb-20 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-inverse.svg" alt="KOVI Finance" className="h-7 w-auto" />
        </div>

        <div className="-mt-16 flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.photoUrl}
            alt={fullName(card)}
            width={144}
            height={144}
            className="size-36 rounded-full border-4 border-paper-2 object-cover shadow-lift"
          />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">{fullName(card)}</h1>
          {card.title && <p className="mt-1 text-muted">{card.title}</p>}
          {card.organization && <p className="mt-1 text-sm text-muted">{card.organization}</p>}
        </div>

        <a href={`/v/${slug}/contact.vcf`} className="button-primary mt-7 w-full">
          Сохранить контакт
        </a>

        <div className="mt-6 flex flex-col gap-2.5">
          {card.phones.map((p) => (
            <a key={p.value} href={`tel:${p.value}`} className={row}>
              <span className="text-sm text-muted">{p.label}</span>
              <span className="font-medium text-ink">{formatPhone(p.value)}</span>
            </a>
          ))}
          {card.email && (
            <a href={`mailto:${card.email}`} className={row}>
              <span className="text-sm text-muted">Почта</span>
              <span className="font-medium text-ink">{card.email}</span>
            </a>
          )}
          {card.site && (
            <Link href="/" className={row}>
              <span className="text-sm text-muted">Сайт</span>
              <span className="font-medium text-ink">{card.site.replace(/^https?:\/\//, "")}</span>
            </Link>
          )}
        </div>

        {card.links.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-2.5">
            {card.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center rounded-xl border border-brand/30 px-2 text-sm font-medium text-brand-dark transition-colors hover:bg-brand-soft"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
