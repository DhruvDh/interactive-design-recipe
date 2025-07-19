import { test, expect } from "@playwright/test";

test.describe("Design Recipe Assistant - Smoke Tests", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-testid="timeline-nav"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="file-tree"]')).toBeVisible({ timeout: 10000 });
  });

  test("should navigate between timeline items", async ({ page }) => {
    await page.goto("/overview");

    // Click on Step 0
    await page.getByRole("link", { name: "Step 0 — Restate" }).click({ timeout: 10000 });
    await expect(page).toHaveURL("/step/0");

    // Click on Step 1
    await page.getByRole("link", { name: "Step 1 — Data Definitions" }).click();
    await expect(page).toHaveURL("/step/1");

    // Click on Overview
    await page.getByRole("link", { name: "Project Overview" }).click();
    await expect(page).toHaveURL("/overview");
  });

  test("should show step 0 after navigation", async ({ page }) => {
    await page.goto("/overview");

    await page.getByRole("link", { name: "Step 0 — Restate" }).click({ timeout: 10000 });
    await expect(page).toHaveURL("/step/0");
    await expect(page.getByRole("heading", { name: /Step 0/i })).toBeVisible();
  });

  // TODO: Add tests for file handling when we have mock project data
  // test('should open file in code viewer', async ({ page }) => {
  //   // This test would require setting up a mock project with files
  //   // For now, we'll keep it as a TODO
  // });
});
