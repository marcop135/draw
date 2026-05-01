import { expect, test } from "@playwright/test";

test("home loads and root mounts", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/draw/i);
  await expect(page.locator("#root")).toBeVisible();

  const gh = page.getByRole("link", { name: "Source code on GitHub" });
  await expect(gh).toBeVisible();
  await expect(gh).toHaveAttribute("href", "https://github.com/marcop135/draw");
});
