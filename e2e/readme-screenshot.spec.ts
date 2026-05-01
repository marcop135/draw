import { test } from "@playwright/test";

/** Run via `npm run capture:readme` — not part of CI. */
test("write docs/app-screenshot.png for README", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  await page.locator(".app-toolbar").waitFor({ state: "visible", timeout: 60_000 });
  await page.locator("#root canvas").first().waitFor({
    state: "visible",
    timeout: 60_000,
  });
  await page.screenshot({
    path: "docs/app-screenshot.png",
    type: "png",
    animations: "disabled",
  });
});
