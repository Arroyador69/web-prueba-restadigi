import puppeteer from "puppeteer";
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "src", "assets");
const outFile = path.join(outDir, "hero-web-devices.jpg");

const URL = "https://freddos.es/";

async function capture(page, width, height, name, scrollY = 0) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("button")];
    const accept = buttons.find((b) => /aceptar|accept|allow|hyväksy/i.test(b.textContent || ""));
    accept?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await new Promise((r) => setTimeout(r, 600));
  }
  const file = path.join(outDir, `_freddo-${name}.png`);
  await page.screenshot({ path: file, type: "png" });
  return file;
}

function roundedRectSvg(w, h, r, fill = "#111") {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${fill}"/></svg>`,
  );
}

async function framedScreen(
  shotPath,
  screenW,
  screenH,
  bezel,
  radius,
  extraBottom = 0,
  position = "top",
) {
  const frameW = screenW + bezel * 2;
  const frameH = screenH + bezel * 2 + extraBottom;
  const screen = await sharp(shotPath)
    .resize(screenW, screenH, { fit: "cover", position })
    .png()
    .toBuffer();

  const mask = roundedRectSvg(screenW, screenH, Math.max(4, radius - 6), "#fff");
  const roundedScreen = await sharp(screen)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const frame = await sharp({
    create: {
      width: frameW,
      height: frameH,
      channels: 4,
      background: { r: 28, g: 24, b: 22, alpha: 1 },
    },
  })
    .composite([
      {
        input: roundedRectSvg(frameW, frameH, radius, "#1c1816"),
        blend: "dest-in",
      },
      {
        input: roundedScreen,
        left: bezel,
        top: bezel,
      },
    ])
    .png()
    .toBuffer();

  return { buf: frame, w: frameW, h: frameH };
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Desktop: hero + juomat näkyviin
  const desktopPath = await capture(page, 1440, 900, "desktop", 180);
  // Tablet & phone: scrollataan niin että juomakuvat ovat ruudulla
  const tabletPath = await capture(page, 834, 1112, "tablet", 420);
  const mobilePath = await capture(page, 390, 844, "mobile", 520);
  await browser.close();

  const canvasW = 2000;
  const canvasH = 780;

  const laptop = await framedScreen(desktopPath, 1040, 640, 18, 18, 36, "top");
  const tablet = await framedScreen(tabletPath, 380, 520, 14, 22, 0, "centre");
  const phone = await framedScreen(mobilePath, 210, 460, 10, 28, 0, "centre");

  const bg = await sharp({
    create: {
      width: canvasW,
      height: canvasH,
      channels: 3,
      background: { r: 67, g: 47, b: 36 },
    },
  })
    .png()
    .toBuffer();

  // Laitteet alempana, heti tekstikaistan yläpuolelle
  const laptopX = Math.round((canvasW - laptop.w) / 2) - 20;
  const laptopY = 48;
  const tabletX = laptopX + laptop.w - 95;
  const tabletY = 68;
  const phoneX = laptopX - 75;
  const phoneY = 90;

  await sharp(bg)
    .composite([
      { input: laptop.buf, left: laptopX, top: laptopY },
      { input: tablet.buf, left: tabletX, top: tabletY },
      { input: phone.buf, left: phoneX, top: phoneY },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outFile);

  console.log("Wrote", outFile);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
