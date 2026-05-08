import { expect, test } from "@playwright/test";

test("landing loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TradingView For Marketplace Product Research Indonesia")).toBeVisible();
});

test("dashboard loads", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("TradingView For Marketplace Product Research Indonesia")).toBeVisible();
});

test("scanner loads", async ({ page }) => {
  await page.goto("/scanner");
  await expect(page.getByText("Riset produk seperti trader membaca market")).toBeVisible();
  await page.getByPlaceholder("Keyword produk...").fill("serum");
  await expect(page.getByText(/products matched current filter set/i)).toBeVisible();
});

test("trending loads", async ({ page }) => {
  await page.goto("/trending");
  await expect(page.getByText("Trending Board")).toBeVisible();
});

test("remaining routes load", async ({ page }) => {
  for (const route of ["/competitors", "/watchlist", "/exports", "/settings", "/pricing"]) {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
  }
});

test("watchlist remove action updates UI", async ({ page }) => {
  await page.goto("/watchlist");
  const before = await page.getByRole("button", { name: /remove/i }).count();
  await page.getByRole("button", { name: /remove/i }).first().click();
  await expect(page.getByRole("button", { name: /remove/i })).toHaveCount(before - 1);
});
