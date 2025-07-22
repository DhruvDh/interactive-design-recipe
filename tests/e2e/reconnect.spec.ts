import { test, expect } from "@playwright/test";

test("auto-reconnect skips when no handle", async ({ page }) => {
  // Clean origin storage
  await page.context().clearCookies();
  await page.goto("/");
  await expect(page.locator('text=Design‑Recipe Workbench')).toBeVisible();
});
