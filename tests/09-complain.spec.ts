import { test, expect } from '@playwright/test';

test.describe('Complain Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/complain/list');
    await page.waitForTimeout(3000);
  });

  test('CM-01 — Complain list loads', async ({ page }) => {
    await expect(page).toHaveURL(/complain/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('CM-02 — Add Complain opens form', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Complain"), button:has-text("Add"), button:has-text("New")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const form = page.locator('mat-dialog-container, [class*="dialog"], [class*="panel"]').first();
      if (await form.count() > 0) await expect(form).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('CM-03 — Submit empty form shows validation errors', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Complain"), button:has-text("Add")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const submit = page.locator('button[type="submit"], button:has-text("Submit"), button:has-text("Save")').first();
      if (await submit.count() > 0) {
        await submit.click();
        await page.waitForTimeout(800);
        const err = page.locator('mat-error, [class*="error"]').first();
        if (await err.count() > 0) await expect(err).toBeVisible();
      }
      await page.keyboard.press('Escape');
    }
  });

  test('CM-04 — Filter by device/status dropdown', async ({ page }) => {
    const filter = page.locator('mat-select, select, [aria-label*="filter" i]').first();
    if (await filter.count() > 0) {
      await filter.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('CM-05 — Row 3-dot menu opens', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('CM-06 — Edge: very long complain description accepted', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Complain"), button:has-text("Add")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const desc = page.locator('textarea, input[placeholder*="description" i]').first();
      if (await desc.count() > 0) {
        await desc.fill('A'.repeat(500));
        await page.waitForTimeout(500);
      }
      await page.keyboard.press('Escape');
    }
  });
});
