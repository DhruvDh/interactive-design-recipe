import { test, expect } from "@playwright/test";

test.describe("Design Recipe Assistant - Smoke Tests", () => {
  test("should load the application", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-testid="nav-sidebar"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="chat-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="timeline-nav"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-tree"]')).toBeVisible();
  });

  test("timeline items disabled until project is loaded", async ({ page }) => {
    await page.goto("/overview");

    const stepLink = page.getByRole("link", { name: "Step 0 — Restate" });
    await expect(stepLink).toHaveAttribute("aria-disabled", "true");
    // Click on Step 0
    await page.getByRole("link", { name: "Step 0 — Restate" }).click({ timeout: 10000 });
    await expect(page).toHaveURL("/step/0");
    await expect(page.getByRole("heading", { name: /Step 0/i })).toBeVisible();

    // Click on Step 1
    await page.getByRole("link", { name: "Step 1 — Data Definitions" }).click();
    await expect(page).toHaveURL("/step/1");
    await expect(page.getByRole("heading", { name: /Step 1/i })).toBeVisible();

    // Click on Overview
    await page.getByRole("link", { name: "Project Overview" }).click();
    await expect(page).toHaveURL("/overview");
    await expect(page.getByRole("heading", { name: /Project Overview/i })).toBeVisible();
  });

  test("finalise route shows idle screen without project", async ({ page }) => {
    await page.goto("/finalise");
    await expect(page.locator('text=Design‑Recipe Workbench')).toBeVisible();
  });

  // TODO: Add tests for file handling when we have mock project data
  // test('should open file in code viewer', async ({ page }) => {
  //   // This test would require setting up a mock project with files
  //   // For now, we'll keep it as a TODO
  // });
});
