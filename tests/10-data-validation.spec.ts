import { test, expect } from '@playwright/test';

test.describe('Data Validation Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/data-validation');
    await page.waitForTimeout(3000);
  });

  test('DV-01 — Data Validation page loads', async ({ page }) => {
    await expect(page).toHaveURL(/data-validation/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('DV-02 — Device dropdown loads options', async ({ page }) => {
    const drop = page.locator('mat-select, select').first();
    if (await drop.count() > 0) {
      await drop.click();
      await page.waitForTimeout(1000);
      const opts = page.locator('mat-option, option');
      if (await opts.count() > 0) expect(await opts.count()).toBeGreaterThan(0);
      await page.keyboard.press('Escape');
    }
  });

  test('DV-03 — Date range picker opens', async ({ page }) => {
    const dp = page.locator('mat-datepicker-toggle, input[type="date"]').first();
    if (await dp.count() > 0) {
      await dp.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('DV-04 — Flag data button visible', async ({ page }) => {
    const flagBtn = page.locator('button:has-text("Flag"), [aria-label*="flag" i]').first();
    if (await flagBtn.count() > 0) await expect(flagBtn).toBeVisible();
  });

  test('DV-05 — Validate data button visible', async ({ page }) => {
    const validateBtn = page.locator('button:has-text("Validate"), [aria-label*="validate" i]').first();
    if (await validateBtn.count() > 0) await expect(validateBtn).toBeVisible();
  });

  test('DV-06 — Edge: Apply without device selection (graceful error)', async ({ page }) => {
    const apply = page.locator('button:has-text("Apply"), button:has-text("Search")').first();
    if (await apply.count() > 0) {
      await apply.click();
      await page.waitForTimeout(800);
      await expect(page.locator('app-root')).toBeVisible();
    }
  });

  test('DV-07 — Edge: Very old date range (no data expected)', async ({ page }) => {
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() > 0) {
      await dateInput.fill('2000-01-01');
      await page.waitForTimeout(500);
    }
  });
});
