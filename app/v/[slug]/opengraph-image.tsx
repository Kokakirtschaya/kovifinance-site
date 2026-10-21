import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { VCARDS } from "@/lib/vcards";

// Своё превью ссылки для визитки: иначе наследуется корневое с брендом KOVI,
// а файловое превью перекрывает openGraph из generateMetadata.
export const alt = "Визитка";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return Object.keys(VCARDS).map((slug) => ({ slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const card = VCARDS[(await params).slug];
  let fonts;
  try {
    const golos = await readFile(join(process.cwd(), "assets/golos-700.woff"));
    fonts = [{ name: "Golos", data: golos, weight: 700 as const, style: "normal" as const }];
  } catch {
    fonts = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 96px",
          background: card?.branded === false ? "#0f2019" : "#0E4634",
          fontFamily: "Golos, sans-serif",
          color: "#fbfaf7",
        }}
      >
        {card && (
          <img
            src={`data:image/jpeg;base64,${card.photoBase64}`}
            width={360}
            height={360}
            alt=""
            style={{ borderRadius: 180, border: "8px solid #fbfaf7" }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Имя и фамилия отдельными строками: длинное имя в одну строку упирается в край. */}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>{card?.givenName}</span>
            <span>{card?.familyName}</span>
          </div>
          <div style={{ fontSize: 34, color: "rgba(251,250,247,0.7)", marginTop: 20 }}>
            Сохранить контакт
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
