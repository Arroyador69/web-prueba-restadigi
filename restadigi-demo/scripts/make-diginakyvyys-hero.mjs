import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assets = path.join(__dirname, "..", "src", "assets");
const out = path.join(assets, "hero-diginakyvyys.jpg");
const basePhoto = path.join(assets, "c-dining-dark.jpg");

const W = 2000;
const H = 1200;

const logos = ["Google", "ChatGPT", "Claude", "Gemini", "Copilot"];

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function logoPillsSvg() {
  const pillH = 52;
  const gap = 16;
  const padX = 28;
  const fontSize = 22;
  // approximate widths
  const widths = logos.map((l) => Math.max(110, l.length * 13 + padX * 2));
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (logos.length - 1);
  const startX = Math.round((W - totalW) / 2);
  let x = startX;
  const y = 120;

  const pills = logos
    .map((label, i) => {
      const w = widths[i];
      const cx = x;
      x += w + gap;
      return `
        <rect x="${cx}" y="${y}" width="${w}" height="${pillH}" rx="${pillH / 2}"
          fill="rgba(255,248,240,0.14)" stroke="rgba(255,236,210,0.35)" stroke-width="1.5"/>
        <text x="${cx + w / 2}" y="${y + pillH / 2 + 1}" text-anchor="middle"
          dominant-baseline="middle" fill="rgba(255,244,230,0.95)"
          font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}"
          font-style="italic">${escapeXml(label)}</text>`;
    })
    .join("\n");

  return Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a1c16" stop-opacity="0.55"/>
          <stop offset="45%" stop-color="#3a2a22" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#1a120e" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#veil)"/>
      ${pills}
      <text x="${W / 2}" y="${y + pillH + 48}" text-anchor="middle"
        fill="rgba(255,236,210,0.55)" font-family="system-ui, sans-serif"
        font-size="15" letter-spacing="0.28em">NÄKYVYYS · AI · HAKU</text>
    </svg>
  `);
}

async function main() {
  const photo = await sharp(basePhoto)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 0.72, saturation: 1.05 })
    .toBuffer();

  await sharp(photo)
    .composite([{ input: logoPillsSvg(), blend: "over" }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

  console.log("Wrote", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
