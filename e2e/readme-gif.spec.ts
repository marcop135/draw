import { expect, test } from "@playwright/test";

/** Run via `npm run capture:readme-gif`; WebM → `docs/readme-demo.gif` via ffmpeg. */
test.describe("readme gif artefact", () => {
  test("record short session for ffmpeg gif", async ({ page }) => {
    await page.goto("/");
    await page.locator(".app-toolbar").waitFor({ timeout: 60_000 });
    const canvas = page.locator("#root canvas").last();
    await canvas.waitFor({ state: "visible", timeout: 60_000 });

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    const { x, y, width, height } = box!;
    const cx = x + width * 0.35;
    const cy = y + height * 0.4;

    await page.mouse.click(cx, cy);

    async function dwell(ms = 350) {
      await page.waitForTimeout(ms);
    }

    // Rectangle (clear frame on canvas)
    await page.keyboard.press("r");
    await dwell(200);
    await page.mouse.move(x + width * 0.22, y + height * 0.24);
    await page.mouse.down();
    await page.mouse.move(x + width * 0.42, y + height * 0.52, { steps: 32 });
    await page.mouse.up();
    await dwell(450);

    // Ellipse
    await page.keyboard.press("o");
    await dwell(200);
    await page.mouse.move(x + width * 0.48, y + height * 0.28);
    await page.mouse.down();
    await page.mouse.move(x + width * 0.68, y + height * 0.48, { steps: 28 });
    await page.mouse.up();
    await dwell(450);

    // Freedraw stroke across the scene
    await page.keyboard.press("7");
    await dwell(200);
    await page.mouse.move(x + width * 0.18, y + height * 0.58);
    await page.mouse.down();
    await page.mouse.move(x + width * 0.55, y + height * 0.38, { steps: 40 });
    await page.mouse.move(x + width * 0.78, y + height * 0.62, { steps: 36 });
    await page.mouse.up();
    await dwell(450);

    // Arrow (two-click)
    await page.keyboard.press("a");
    await dwell(200);
    await page.mouse.click(x + width * 0.72, y + height * 0.22);
    await page.mouse.click(x + width * 0.88, y + height * 0.4);
    await dwell(500);

    await page.getByRole("link", { name: "Source code on GitHub" }).hover();
    await page.mouse.move(400, 200);
    await expect(page.locator(".app-toolbar")).toBeVisible();
    await page.waitForTimeout(2200);
  });
});
