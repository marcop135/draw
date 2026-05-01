import { defineConfig } from "@playwright/test";

/** Records WebM for README GIF — not part of CI. */
export default defineConfig({
  testDir: "e2e",
  testMatch: /readme-gif\.spec\.ts$/,
  fullyParallel: false,
  forbidOnly: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "off",
    viewport: { width: 1280, height: 720 },
    video: {
      mode: "on",
      size: { width: 1280, height: 720 },
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        viewport: { width: 1280, height: 720 },
        video: {
          mode: "on",
          size: { width: 1280, height: 720 },
        },
      },
    },
  ],
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
