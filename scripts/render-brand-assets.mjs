// Renders favicon and app icons from the SVG sources in public/:
// - favicon.svg (transparent corners) -> favicon-16x16.png, favicon-32x32.png,
//   favicon-48x48.png, android-chrome-192x192.png, android-chrome-512x512.png,
//   and favicon.ico (16/32/48 PNG entries)
// - favicon-maskable.svg (full bleed, opaque) -> apple-touch-icon.png (180),
//   maskable-512x512.png
//
// README, GitHub social and OG images live in .github/brand/ (npm run brand:images).
// Rendering is via headless Chromium to keep zero new runtime dependencies.

import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

const browser = await chromium.launch();

async function renderSvg(svgPath, size, outPath, transparent) {
  const svg = readFileSync(svgPath, "utf8");
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;background:transparent}
    svg{display:block;width:${size}px;height:${size}px}
  </style></head><body>${svg}</body></html>`;
  await page.setContent(html, { waitUntil: "load" });
  const buf = await page.screenshot({
    type: "png",
    omitBackground: transparent,
    clip: { x: 0, y: 0, width: size, height: size },
  });
  writeFileSync(outPath, buf);
  await page.close();
  console.log(`[icon] ${size}x${size} -> public/${basename(outPath)} (${buf.length} bytes)`);
  return buf;
}

const faviconSvg = join(publicDir, "favicon.svg");
const maskableSvg = join(publicDir, "favicon-maskable.svg");

const rendered = {};
for (const [size, name] of [
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"],
  [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
]) {
  rendered[size] = await renderSvg(faviconSvg, size, join(publicDir, name), true);
}
// iOS ignores transparency on home-screen icons; ship them opaque and full bleed.
await renderSvg(maskableSvg, 180, join(publicDir, "apple-touch-icon.png"), false);
await renderSvg(maskableSvg, 512, join(publicDir, "maskable-512x512.png"), false);

// favicon.ico = PNG entries in an ICO container.
// Spec: ICONDIR (6) + ICONDIRENTRY (16 each) + image data.
function buildIco(images) {
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type = icon
  dir.writeUInt16LE(images.length, 4); // count
  let offset = 6 + 16 * images.length;
  const entries = images.map(([sizePx, png]) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(sizePx === 256 ? 0 : sizePx, 0); // width (0 means 256)
    entry.writeUInt8(sizePx === 256 ? 0 : sizePx, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(png.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // offset
    offset += png.length;
    return entry;
  });
  return Buffer.concat([dir, ...entries, ...images.map(([, png]) => png)]);
}
const ico = buildIco([16, 32, 48].map((s) => [s, rendered[s]]));
writeFileSync(join(publicDir, "favicon.ico"), ico);
console.log(`[icon] ico 16/32/48 -> public/favicon.ico (${ico.length} bytes)`);

await browser.close();
