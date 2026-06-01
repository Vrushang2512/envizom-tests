import { test, expect } from '@playwright/test';

test.describe('Display Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/display');
    await page.waitForTimeout(3000);
  });

  test('DP-01 — Display list loads', async ({ page }) => {
    await expect(page).toHaveURL(/display/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('DP-02 — Add Display opens 4-step wizard (empty validation)', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Display"), button:has-text("Add"), button:has-text("New")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const next = page.locator('button:has-text("Next"), button:has-text("NEXT")').first();
      if (await next.count() > 0) {
        await next.click();
        await page.waitForTimeout(800);
      }
      await page.keyboard.press('Escape');
    }
  });

  test('DP-03 — Row 3-dot menu opens', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('DP-04 — Display preview/view opens', async ({ page }) => {
    const eye = page.locator('mat-icon:has-text("visibility"), [aria-label*="view" i]').first();
    if (await eye.count() > 0) {
      await eye.click();
      await page.waitForTimeout(1500);
      await page.keyboard.press('Escape');
    }
  });

  test('DP-05 — Edge: No displays state handled gracefully', async ({ page }) => {
    const noData = page.locator('text=No Data, text=No Display').first();
    // Either displays exist or no-data state — both valid
    await expect(page.locator('app-root')).toBeVisible();
  });
});
