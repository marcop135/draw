// Capture the README screenshots: desktop and mobile, light and dark.
// Usage: node scripts/readme-shots.mjs   (npm run readme:shots)
// Expects `npm run preview` on :4173. Builds a demo scene once through the
// real UI (LaTeX modal, Markdown modal, Mermaid to Excalidraw), then replays it
// through window.draw.setScene in each viewport and color scheme.
// Writes docs/readme/{desktop,mobile}-{light,dark}.png.
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseURL = process.env.README_SHOTS_URL ?? "http://127.0.0.1:4173";
const outDir = resolve(__dirname, "..", "docs", "readme");
mkdirSync(outDir, { recursive: true });

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

const LATEX = String.raw`a^2 + b^2 = c^2`;
const MARKDOWN = `## Pythagoras

- Sketch the triangle by hand
- Typeset the formula with **LaTeX**
- Export the page as a **PDF**`;
const MERMAID = `flowchart LR
  A[Sketch] --> B[Typeset] --> C[Export]`;

const INK = "#1e1e1e";
const base = (id, extra) => ({
  id,
  angle: 0,
  strokeColor: INK,
  backgroundColor: "transparent",
  fillStyle: "solid",
  strokeWidth: 2,
  strokeStyle: "solid",
  roughness: 1,
  opacity: 100,
  seed: id.length * 7919,
  ...extra,
});
const text = (id, x, y, value, fontSize, color = INK) =>
  base(id, {
    type: "text",
    x,
    y,
    text: value,
    originalText: value,
    fontSize,
    fontFamily: 5,
    textAlign: "left",
    verticalAlign: "top",
    strokeColor: color,
    width: value.length * fontSize * 0.55,
    height: fontSize * 1.25,
  });

// Hand-drawn part of the scene; the inserts are added through the UI.
const SEED = [
  text("title", 0, 0, "Right triangles", 40),
  base("triangle", {
    type: "line",
    x: 40,
    y: 110,
    width: 300,
    height: 220,
    backgroundColor: "#a5d8ff",
    fillStyle: "hachure",
    points: [
      [0, 0],
      [0, 220],
      [300, 220],
      [0, 0],
    ],
  }),
  base("right-angle", {
    type: "line",
    x: 40,
    y: 302,
    width: 28,
    height: 28,
    points: [
      [0, 0],
      [28, 0],
      [28, 28],
    ],
  }),
  text("label-a", 6, 200, "a", 28, "#1971c2"),
  text("label-b", 180, 338, "b", 28, "#1971c2"),
  text("label-c", 200, 180, "c", 28, "#e03131"),
  base("arrow", {
    type: "arrow",
    x: 360,
    y: 200,
    width: 110,
    height: 0,
    strokeColor: "#e03131",
    points: [
      [0, 0],
      [110, 0],
    ],
    endArrowhead: "arrow",
  }),
];

const scene = (elements, files = {}) =>
  JSON.stringify({
    type: "excalidraw",
    version: 2,
    source: baseURL,
    elements,
    appState: {},
    files,
  });

const settle = async (page) => {
  await page.waitForSelector(".app-toolbar", { state: "visible", timeout: 15000 });
  await page.waitForFunction(() => !!window.draw);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
};

const elementIds = async (page) =>
  JSON.parse(await page.evaluate(() => window.draw.getScene())).elements.map((e) => e.id);

async function insertVia(page, kind, source) {
  await page.locator('.app-toolbar button[aria-label="Insert"]').click();
  await page.locator('.menu-pop[role="menu"] button', { hasText: kind }).click();
  const modal = page.locator(".app-modal");
  await modal.waitFor({ timeout: 8000 });
  await modal.locator("textarea").fill(source);
  await page.waitForTimeout(400);
  await modal.locator("button", { hasText: /^Insert$/ }).click();
  await modal.waitFor({ state: "detached", timeout: 8000 });
}

async function insertMermaid(page) {
  await page.locator(".App-toolbar__extra-tools-trigger").click();
  await page.getByText("Mermaid to Excalidraw").click();
  const input = page.locator(".ttd-dialog textarea").first();
  await input.waitFor({ timeout: 8000 });
  await input.fill(MERMAID);
  await page.waitForTimeout(1500);
  await page.locator(".ttd-dialog button", { hasText: /Insert/ }).click();
  await page.locator(".ttd-dialog").waitFor({ state: "detached", timeout: 8000 });
}

function bbox(els) {
  const xs = els.flatMap((e) => [e.x, e.x + e.width]);
  const ys = els.flatMap((e) => [e.y, e.y + e.height]);
  return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) };
}
const moveTo = (els, x, y) => {
  const b = bbox(els);
  for (const e of els) {
    e.x += x - b.x;
    e.y += y - b.y;
  }
};

async function buildScene(browser) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS.desktop, colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(baseURL, { waitUntil: "load" });
  await settle(page);
  await page.evaluate((json) => window.draw.setScene(json), scene(SEED));

  const before = new Set(await elementIds(page));
  await insertVia(page, "LaTeX", LATEX);
  const afterLatex = await elementIds(page);
  const latexIds = afterLatex.filter((id) => !before.has(id));
  await insertVia(page, "Markdown", MARKDOWN);
  const afterMd = await elementIds(page);
  const mdIds = afterMd.filter((id) => !afterLatex.includes(id));
  await insertMermaid(page);

  const data = JSON.parse(await page.evaluate(() => window.draw.getScene()));
  await ctx.close();

  const live = data.elements.filter((e) => !e.isDeleted);
  const seedIds = new Set(SEED.map((e) => e.id));
  const mermaidIds = live
    .map((e) => e.id)
    .filter((id) => !seedIds.has(id) && !latexIds.includes(id) && !mdIds.includes(id));
  if (!latexIds.length || !mdIds.length || !mermaidIds.length) {
    throw new Error(
      `insert missing: latex ${latexIds.length}, markdown ${mdIds.length}, mermaid ${mermaidIds.length}`,
    );
  }

  // Per viewport: a wide layout for desktop, a single column for phones.
  const layout = (vp) => {
    const els = structuredClone(live);
    const pick = (ids) => els.filter((e) => ids.includes(e.id));
    const latex = pick(latexIds);
    // Inserts land at their default size; double the formula so it reads at README width.
    for (const e of latex) {
      e.width *= 2;
      e.height *= 2;
    }
    if (vp === "desktop") {
      moveTo(latex, 500, 150);
      moveTo(pick(mdIds), 800, 320);
      moveTo(pick(mermaidIds), 40, 450);
      return scene(els, data.files);
    }
    moveTo(latex, 20, 400);
    moveTo(pick(mdIds), 0, 500);
    moveTo(pick(mermaidIds), 0, 700);
    // Fit-to-content runs edge to edge on phones; an invisible spacer adds a margin.
    const w = bbox(pick(mermaidIds)).w;
    const spacer = base("spacer", { type: "rectangle", x: -24, y: 700, width: w + 48, height: 1, opacity: 0 });
    return scene([...els.filter((e) => e.id !== "arrow"), spacer], data.files);
  };
  return { desktop: layout("desktop"), mobile: layout("mobile") };
}

async function shoot(browser, json, vp, scheme) {
  const ctx = await browser.newContext({
    viewport: VIEWPORTS[vp],
    colorScheme: scheme,
    reducedMotion: "reduce",
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(baseURL, { waitUntil: "load" });
  await settle(page);
  await page.evaluate((s) => window.draw.setScene(s), json);
  await page.keyboard.press("Escape");
  await page.mouse.move(1, VIEWPORTS[vp].height / 2);
  await page.waitForTimeout(900);
  const png = await page.screenshot();
  await ctx.close();
  const file = join(outDir, `${vp}-${scheme}.png`);
  writeFileSync(file, await sharp(png).png({ compressionLevel: 9, effort: 10, palette: true }).toBuffer());
  console.log("  saved", `${vp}-${scheme}.png`);
}

const browser = await chromium.launch();
try {
  const scenes = await buildScene(browser);
  for (const vp of Object.keys(VIEWPORTS)) {
    for (const scheme of ["light", "dark"]) await shoot(browser, scenes[vp], vp, scheme);
  }
} finally {
  await browser.close();
}
console.log(`Done -> ${outDir}`);
