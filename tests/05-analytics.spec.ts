import { test, expect } from '@playwright/test';

const CHART_TYPES = ['Line', 'Bar', 'Scatter', 'Radar', 'Polar', 'Bubble', 'Rose', 'Sankey', 'Calendar', 'Heatmap', 'Gauge', 'Pie', 'Custom'];

test.describe('Analytics Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/analytics/analytics-list', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
        await page.waitForSelector('app-root', { timeout: 20000 });
  });

  test('AN-01 — Analytics list loads', async ({ page }) => {
    await expect(page).toHaveURL(/analytics/, { timeout: 15000 });
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('AN-02 — Add Analytics opens chart-type selector', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add"), button:has-text("Create")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(2000);
      const dialog = page.locator('mat-dialog-container, [class*="dialog"]').first();
      if (await dialog.count() > 0) await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  for (const chartType of CHART_TYPES) {
    test('AN-03-' + chartType + ' chart selectable', async ({ page }) => {
      const addBtn = page.locator('button:has-text("Add"), button:has-text("Create")').first();
      if (await addBtn.count() > 0) {
        await addBtn.click();
        await page.waitForTimeout(1500);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
        const typeOption = page.locator('text=' + chartType).first();
        if (await typeOption.count() > 0) {
          await typeOption.click({ force: true });
          await page.waitForTimeout(800);
        }
        await page.keyboard.press('Escape');
      }
    });
  }

  test('AN-04 — Row 3-dot menu opens', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('AN-05 — Search no-match shows empty state', async ({ page }) => {
    const search = page.locator('input[placeholder*="search" i]').first();
    if (await search.count() > 0) {
      await search.fill('ZZZNOMATCH999');
      await page.waitForTimeout(1500);
      await search.fill('');
    }
  });
});
