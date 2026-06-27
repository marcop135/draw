import { expect, test } from "@playwright/test";

test("home loads and root mounts", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/draw/i);
  await expect(page.locator("#root")).toBeVisible();

  // App chrome rendered: the floating toolbar's Export button is present.
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
});
