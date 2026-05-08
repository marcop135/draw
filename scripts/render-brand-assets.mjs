// Renders brand assets at build-time-equivalent quality:
// - public/social-preview.png  (1280x640, GitHub social card, kept under 1 MB)
// - public/favicon-16x16.png, favicon-32x32.png, favicon-48x48.png
// - public/apple-touch-icon.png (180x180)
// - public/android-chrome-192x192.png, android-chrome-512x512.png
// - public/favicon.ico (single 32x32 PNG embedded, modern browsers)
//
// All sources are SVGs already in the repo; rendering is via headless Chromium
// to keep zero new runtime dependencies.

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const browser = await chromium.launch();

async function renderSvg(svgPath, width, height, outPath) {
  const svg = readFileSync(svgPath, "utf8");
  const page = await browser.newPage({ viewport: { width, height } });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:transparent}
    svg{display:block;width:${width}px;height:${height}px}
  </style></head><body>${svg}</body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  const buf = await page.screenshot({
    type: "png",
    omitBackground: false,
    clip: { x: 0, y: 0, width, height },
  });
  writeFileSync(outPath, buf);
  await page.close();
  return buf;
}

// 1) Social preview: 1280x640 from assets/social-preview.svg
const socialBuf = await renderSvg(
  join(root, "assets", "social-preview.svg"),
  1280,
  640,
  join(publicDir, "social-preview.png"),
);
console.log(
  `[social-preview] 1280x640 -> public/social-preview.png (${socialBuf.length} bytes)`,
);
if (socialBuf.length >= 1024 * 1024) {
  throw new Error(
    `social-preview.png is ${socialBuf.length} bytes, exceeds GitHub's 1 MB limit`,
  );
}

// 2) Favicons + apple touch + PWA icons from public/favicon.svg
const faviconSvg = join(publicDir, "favicon.svg");
const faviconSizes = [
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"],
  [180, "apple-touch-icon.png"],
  [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
];
const rendered = {};
for (const [size, name] of faviconSizes) {
  const buf = await renderSvg(faviconSvg, size, size, join(publicDir, name));
  rendered[size] = buf;
  console.log(`[favicon] ${size}x${size} -> public/${name} (${buf.length} bytes)`);
}

// 3) favicon.ico = single 32x32 PNG embedded in ICO container.
// Modern browsers (and IE11) read PNG-in-ICO. Spec: ICONDIR (6) + ICONDIRENTRY (16) + image data.
function buildIco(pngBuf, sizePx) {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type = icon
  dir.writeUInt16LE(1, 4); // count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(sizePx === 256 ? 0 : sizePx, 0); // width (0 means 256)
  entry.writeUInt8(sizePx === 256 ? 0 : sizePx, 1); // height
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bit count
  entry.writeUInt32LE(pngBuf.length, 8); // bytes in resource
  entry.writeUInt32LE(6 + 16, 12); // offset
  return Buffer.concat([dir, entry, pngBuf]);
}
const ico = buildIco(rendered[32], 32);
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log(`[favicon] ico -> public/favicon.ico (${ico.length} bytes)`);

await browser.close();
