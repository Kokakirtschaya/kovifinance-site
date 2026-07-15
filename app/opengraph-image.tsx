import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "KOVI Finance — финансирование для бизнеса";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect x="18" y="12" width="17" height="76" fill="#ffffff"/><path d="M82 14 L46 50 L82 86" fill="none" stroke="#FFD23F" stroke-width="17"/></svg>`;
const markData = `data:image/svg+xml;base64,${Buffer.from(markSvg).toString("base64")}`;

export default async function OG() {
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
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0E4634",
          padding: "72px 80px",
          fontFamily: "Golos, sans-serif",
          color: "#fbfaf7",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markData} width={84} height={84} alt="" />
          <div style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>KOVI Finance</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Финансирование
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            <span>для бизнеса —&nbsp;</span>
            <span style={{ color: "#FFD23F" }}>быстро</span>
          </div>
          <div style={{ fontSize: 30, color: "rgba(251,250,247,0.7)", marginTop: 24 }}>
            Кредиты · Гарантии · Факторинг · Лизинг · 40+ банков
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "rgba(251,250,247,0.6)",
          }}
        >
          <span>Независимый брокер — на стороне заёмщика</span>
          <span style={{ color: "#FFD23F", fontWeight: 700 }}>kovifinance.ru</span>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
