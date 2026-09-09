import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Bella Pratas — Detalhes que ficam. Histórias que brilham.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function ShareImage() {
  const logo = await readFile(path.join(process.cwd(), "public/Imagens-do-site/logo-social.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#000000", padding: 30 }}>
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid #9a7b59", position: "relative" }}>
        <div style={{ display: "flex", fontSize: 15, letterSpacing: 6, color: "#c7ae8d", marginBottom: 40 }}>O EXTRAORDINÁRIO ESTÁ NOS DETALHES</div>
        {/* The original logo is embedded so crawlers never need a second request. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} alt="" width={760} height={242} />
        <div style={{ display: "flex", width: 70, height: 1, background: "#9a7b59", marginTop: 28, marginBottom: 28 }} />
        <div style={{ display: "flex", fontSize: 25, color: "#f1e8db", letterSpacing: 1 }}>Detalhes que ficam. Histórias que brilham.</div>
      </div>
    </div>,
    size,
  );
}

