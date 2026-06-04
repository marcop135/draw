// Capture UI screenshots across breakpoints + themes for visual-regression
// review during an optimization audit. Usage:
//   node scripts/audit-shots.mjs <label>
// Writes PNGs to docs/audit/<label>/. Expects `npm run preview` on :4173.
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const label = process.argv[2] ?? "baseline";
const baseURL = process.env.AUDIT_URL ?? "http://127.0.0.1:4173";
const outDir = resolve(__dirname, "..", "docs", "audit", label);
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844 },
};

const shot = async (page, name) => {
  const file = join(outDir, `${name}.png`);
  await page.screenshot({ path: file });
  console.log("  saved", `${name}.png`);
};

const settle = async (page) => {
  await page.waitForSelector(".app-toolbar", { state: "visible", timeout: 15000 });
  await page.waitForTimeout(900); // let Excalidraw canvas + fonts settle
};

const browser = await chromium.launch();
try {
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    for (const scheme of ["light", "dark"]) {
      const ctx = await browser.newContext({
        viewport: size,
        colorScheme: scheme,
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      await page.goto(baseURL, { waitUntil: "load" });
      await settle(page);
      await shot(page, `${vp}-${scheme}-load`);

      // Desktop light: also capture interactive chrome (menus + a modal).
      if (vp === "desktop" && scheme === "light") {
        try {
          const insert = page.locator('.app-toolbar button[aria-haspopup="menu"]').first();
          await insert.click();
          await page.waitForSelector('.menu-pop[role="menu"]', { timeout: 5000 });
          await shot(page, `${vp}-insert-menu`);

          await page.locator('.menu-pop[role="menu"] button', { hasText: "LaTeX" }).click();
          await page.waitForSelector(".app-modal", { timeout: 8000 });
          await page.waitForTimeout(400);
          await shot(page, `${vp}-latex-modal`);
          await page.keyboard.press("Escape");
        } catch (err) {
          console.warn("  [warn] interactive capture failed:", err.message);
        }
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`Done -> ${outDir}`);
