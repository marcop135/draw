import { expect, test } from "@playwright/test";

/** Run via `npm run capture:readme-gif`; WebM → `docs/readme-demo.gif` via ffmpeg. */
test.describe("readme gif artefact", () => {
  test("record short session for ffmpeg gif", async ({ page }) => {
    await page.goto("/");
    await page.locator(".app-toolbar").waitFor({ timeout: 60_000 });
    await page.locator("#root canvas").first().waitFor({
      state: "visible",
      timeout: 60_000,
    });
    await page.getByRole("link", { name: "Source code on GitHub" }).hover();
    await page.mouse.move(400, 200);
    await expect(page.locator(".app-toolbar")).toBeVisible();
    // Let the canvas + toolbar stay on-screen so the WebM has enough motion for a readable GIF.
    await page.waitForTimeout(2500);
  });
});
