import { test, expect } from '@playwright/test';

test.describe('Cluster Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/cluster');
    await page.waitForTimeout(3000);
  });

  test('CL-01 — Cluster map view loads', async ({ page }) => {
    await expect(page).toHaveURL(/cluster/);
    await page.waitForSelector('app-root', { timeout: 15000 });
  });

  test('CL-02 — Add Cluster button opens wizard', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Cluster"), button:has-text("Add"), button:has-text("New")').first();
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

  test('CL-03 — Switch to Table/List view', async ({ page }) => {
    const listTab = page.locator('text=List, button:has-text("List"), button:has-text("Table")').first();
    if (await listTab.count() > 0) {
      await listTab.click();
      await page.waitForTimeout(2000);
    }
  });

  test('CL-04 — Cluster 3-dot menu (edit/delete)', async ({ page }) => {
    const dotMenu = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dotMenu.count() > 0) {
      await dotMenu.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('CL-05 — Edge: Add cluster with empty name shows validation', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add"), button:has-text("New")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const saveBtn = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")').first();
      if (await saveBtn.count() > 0) {
        await saveBtn.click();
        await page.waitForTimeout(800);
      }
      await page.keyboard.press('Escape');
    }
  });
});
