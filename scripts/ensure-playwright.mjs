/**
 * Runs from package.json postinstall after `npm ci` / `npm install`.
 * Installs Chromium for Playwright on developer machines only.
 */

import { execSync } from "node:child_process";

const skip =
  process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1" ||
  process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "true";
if (skip) {
  console.log(
    "[ensure-playwright] PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD set, skipping Chromium install.",
  );
  process.exit(0);
}

if (process.env.GITHUB_ACTIONS === "true" || process.env.CI === "true") {
  process.exit(0);
}

execSync("npx playwright install chromium", {
  stdio: "inherit",
  shell: process.platform === "win32",
});
