import { expect, test } from "@playwright/test";

test("landing loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("TradingView For Marketplace Product Research Indonesia")).toBeVisible();
});

test("dashboard loads", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.getByText("TradingView For Marketplace Product Research Indonesia")).toBeVisible();
});

test("GET /api/products returns data array", async ({ request }) => {
  const response = await request.get("/api/products");
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  expect(Array.isArray(payload.data)).toBe(true);
  expect(payload.data.length).toBeGreaterThan(0);
});

test("POST /api/extension/ingest accepts visible DOM payload and returns received count", async ({ request }) => {
  const response = await request.post("/api/extension/ingest", {
    data: {
      marketplace: "shopee",
      url: "https://shopee.co.id/search?keyword=serum",
      scannedAt: new Date("2026-01-01T00:00:00.000Z").toISOString(),
      products: [
        {
          title: "Serum Wajah Brightening",
          price: 89000,
          sold: 1200,
          rating: 4.8
        },
        {
          title: "Rak Dapur Minimalis",
          price: 159000,
          sold: 340,
          rating: 4.7
        }
      ]
    }
  });
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  expect(payload.ok).toBe(true);
  expect(payload.received).toBe(2);
});

test("POST /api/extension/ingest rejects invalid payload", async ({ request }) => {
  const response = await request.post("/api/extension/ingest", {
    data: { products: "not-an-array" }
  });
  expect(response.status()).toBe(400);
  const payload = await response.json();
  expect(payload.ok).toBe(false);
});

test("watchlist API add/remove behavior works", async ({ request }) => {
  const addResponse = await request.post("/api/watchlist", {
    data: {
      productId: "prd_1",
      notes: "api test"
    }
  });
  expect(addResponse.ok()).toBeTruthy();

  const listResponse = await request.get("/api/watchlist");
  expect(listResponse.ok()).toBeTruthy();
  const listPayload = await listResponse.json();
  expect(Array.isArray(listPayload.data)).toBe(true);
  expect(listPayload.data.length).toBeGreaterThan(0);

  const deleteResponse = await request.delete("/api/watchlist/prd_1");
  expect(deleteResponse.ok()).toBeTruthy();
});

test("scanner loads", async ({ page }) => {
  await page.goto("/scanner");
  await expect(page.getByText("Product momentum, not just product list")).toBeVisible();
  await page.getByPlaceholder("Keyword produk...").fill("serum");
  await expect(page.getByText(/products matched current filter set/i)).toBeVisible();
});

test("trending loads", async ({ page }) => {
  await page.goto("/trending");
  await expect(page.getByText("Trending Board", { exact: true })).toBeVisible();
});

test("remaining routes load", async ({ page }) => {
  for (const route of ["/competitors", "/watchlist", "/exports", "/settings", "/pricing"]) {
    await page.goto(route);
    await expect(page.locator("h1").first()).toBeVisible();
  }
});

test("main navigation does not crash", async ({ page }) => {
  await page.goto("/dashboard");
  for (const route of ["/scanner", "/trending", "/watchlist", "/exports", "/settings", "/dashboard"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
  }
});

test("watchlist remove action updates UI", async ({ page }) => {
  await page.goto("/watchlist");
  const before = await page.getByRole("button", { name: /remove/i }).count();
  await page.getByRole("button", { name: /remove/i }).first().click();
  await expect(page.getByRole("button", { name: /remove/i })).toHaveCount(before - 1);
});
