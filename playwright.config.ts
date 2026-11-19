import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  forbidOnly: !!process.env.CI,
  use: { baseURL: "http://localhost:3000" },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    command: "node tests/serve.ts",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
