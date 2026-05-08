import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "../../tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000"
  },
  webServer: {
    command: "cd /Users/adith92/Documents/Codex/hype2profit/apps/web && pnpm exec next start --hostname 127.0.0.1 --port 3000",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120000
  }
});
