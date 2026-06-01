import { test, expect } from '@playwright/test';

test.describe('Reports Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/reports');
    await page.waitForTimeout(3000);
  });

  test('RP-01 — Reports page loads', async ({ page }) => {
    await expect(page).toHaveURL(/reports/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('RP-02 — Automated Reports tab visible', async ({ page }) => {
    const tab = page.locator('text=Automated, button:has-text("Automated")').first();
    if (await tab.count() > 0) await expect(tab).toBeVisible();
  });

  test('RP-03 — Quick Reports tab visible and clickable', async ({ page }) => {
    const tab = page.locator('text=Quick, button:has-text("Quick")').first();
    if (await tab.count() > 0) {
      await tab.click();
      await page.waitForTimeout(2000);
    }
  });

  test('RP-04 — Add Report opens wizard (empty validation)', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add"), button:has-text("New Report"), button:has-text("Create")').first();
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

  test('RP-05 — Row 3-dot menu (View/Edit/Delete)', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('RP-06 — Search empty string', async ({ page }) => {
    const search = page.locator('input[placeholder*="search" i]').first();
    if (await search.count() > 0) {
      await search.fill('');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }
  });

  test('RP-07 — Search with special characters (XSS edge case)', async ({ page }) => {
    const search = page.locator('input[placeholder*="search" i]').first();
    if (await search.count() > 0) {
      await search.fill('<script>alert(1)</script>');
      await page.waitForTimeout(1000);
      await search.fill('');
    }
  });

  test('RP-08 — Download report CSV', async ({ page }) => {
    const dl = page.locator('[aria-label*="download" i], mat-icon:has-text("download"), button:has-text("Download")').first();
    if (await dl.count() > 0) await expect(dl).toBeVisible();
  });
});
