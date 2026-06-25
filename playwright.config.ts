import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on",
    video: "retain-on-failure",
    screenshot: "off",
  },
  // slowMo lives on the launcher, not use — set per-project below

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions: { slowMo: 400 } },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});
