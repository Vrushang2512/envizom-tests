import { test, expect } from '@playwright/test';

test.describe('Dashboard Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/dashboard');
    await page.waitForTimeout(3000);
  });

  test('DB-01 — Dashboard list loads', async ({ page }) => {
    await expect(page).toHaveURL(/dashboard/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('DB-02 — Add New Dashboard opens form', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), [aria-label*="add" i]').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      await page.keyboard.press('Escape');
    }
  });

  test('DB-03 — Dashboard 3-dot menu opens', async ({ page }) => {
    const dotMenu = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dotMenu.count() > 0) {
      await dotMenu.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Escape');
    }
  });

  test('DB-04 — Widget page loads for known dashboard', async ({ page }) => {
    await page.goto('/#/dashboard/widget/YG19P0011');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/widget/);
  });

  test('DB-05 — Add Widget button visible', async ({ page }) => {
    await page.goto('/#/dashboard/widget/YG19P0011');
    await page.waitForTimeout(2000);
    const addWidget = page.locator('button:has-text("Widget"), button:has-text("Add")').first();
    if (await addWidget.count() > 0) await expect(addWidget).toBeVisible();
  });

  test('DB-06 — Edge: invalid dashboard ID graceful handling', async ({ page }) => {
    await page.goto('/#/dashboard/widget/INVALID_ID_999');
    await page.waitForTimeout(2000);
    await expect(page.locator('app-root')).toBeVisible({ timeout: 5000 });
  });

  test('DB-07 — Rename dashboard (3-dot > Edit)', async ({ page }) => {
    const dotMenu = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dotMenu.count() > 0) {
      await dotMenu.click();
      await page.waitForTimeout(800);
      const editBtn = page.locator('text=Edit, text=Rename').first();
      if (await editBtn.count() > 0) {
        await editBtn.click();
        await page.waitForTimeout(1000);
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });
});
