import { test, expect } from "@playwright/test";

test.describe("Design Recipe Assistant - Smoke Tests", () => {
  test("should load the application and navigate to project selection", async ({
    page,
  }) => {
    await page.goto("/");

    // Should redirect to project selection page
    await expect(page).toHaveURL("/project");
    await expect(page.locator('[data-testid="timeline-nav"]')).toBeVisible();
    await expect(page.locator('[data-testid="file-tree"]')).toBeVisible();
  });

  test("should navigate between timeline items", async ({ page }) => {
    await page.goto("/project");

    // Click on Step 0
    await page.locator('[data-testid="nav-step0"]').click();
    await expect(page).toHaveURL("/step/0");

    // Click on Step 1
    await page.locator('[data-testid="nav-step1"]').click();
    await expect(page).toHaveURL("/step/1");

    // Click on Overview
    await page.locator('[data-testid="nav-overview"]').click();
    await expect(page).toHaveURL("/overview");
  });

  test("should show project selection page by default", async ({ page }) => {
    await page.goto("/project");

    // Should show project selection content
    await expect(page.locator("h1").first()).toContainText(
      "Design Recipe Workbench"
    );
    await expect(
      page.getByRole("button", { name: "Select Project Folder" })
    ).toBeVisible();
  });

  // TODO: Add tests for file handling when we have mock project data
  // test('should open file in code viewer', async ({ page }) => {
  //   // This test would require setting up a mock project with files
  //   // For now, we'll keep it as a TODO
  // });
});
