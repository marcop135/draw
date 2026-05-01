import { defineConfig, devices } from "@playwright/test";

/** README screenshot capture only; avoids running this alongside CI smoke tests. */
export default defineConfig({
  testDir: "e2e",
  testMatch: /readme-screenshot\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
