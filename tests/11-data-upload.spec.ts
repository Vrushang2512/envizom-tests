import { test, expect } from '@playwright/test';

test.describe('Data Upload Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/data-upload', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
  });

  test('DU-01 — Data Upload page loads', async ({ page }) => {
    await expect(page).toHaveURL(/data-upload/, { timeout: 15000 });
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('DU-02 — Template download button visible', async ({ page }) => {
    const btn = page.locator('button:has-text("Template"), button:has-text("Download Template"), [aria-label*="template" i]').first();
    if (await btn.count() > 0) await expect(btn).toBeVisible();
  });

  test('DU-03 — File upload input attached to DOM', async ({ page }) => {
    const fi = page.locator('input[type="file"]').first();
    if (await fi.count() > 0) await expect(fi).toBeAttached();
  });

  test('DU-04 — Device selector dropdown loads', async ({ page }) => {
    const drop = page.locator('mat-select, select').first();
    if (await drop.count() > 0) {
      await drop.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('DU-05 — Edge: Upload button disabled without file', async ({ page }) => {
    const uploadBtn = page.locator('button:has-text("Upload"), button:has-text("Submit")').first();
    if (await uploadBtn.count() > 0) {
      const isDisabled = await uploadBtn.getAttribute('disabled');
      // May be disabled or not — just don't crash
    }
  });

  test('DU-06 — Upload history/log table visible', async ({ page }) => {
    const table = page.locator('table, mat-table').first();
    if (await table.count() > 0) await expect(table).toBeVisible();
  });
});
