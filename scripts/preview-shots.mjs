import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const URL = process.env.PREVIEW_URL ?? "http://localhost:5173/";
const outDir = resolve("docs/preview");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

async function shoot(name, opts) {
  const ctx = await browser.newContext({
    viewport: opts.viewport,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  if (opts.openMenu) {
    await page.getByRole("button", { name: opts.openMenu }).click();
    await page.waitForTimeout(150);
  }
  await page.screenshot({ path: resolve(outDir, name), fullPage: false });
  await ctx.close();
  console.log("wrote", name);
}

await shoot("desktop-toolbar.png", { viewport: { width: 1280, height: 720 } });
await shoot("desktop-insert-open.png", {
  viewport: { width: 1280, height: 720 },
  openMenu: /^Insert/,
});
await shoot("desktop-export-open.png", {
  viewport: { width: 1280, height: 720 },
  openMenu: /^Export/,
});
await shoot("mobile-toolbar.png", { viewport: { width: 390, height: 780 } });
await shoot("mobile-insert-open.png", {
  viewport: { width: 390, height: 780 },
  openMenu: /^Insert/,
});

await browser.close();
