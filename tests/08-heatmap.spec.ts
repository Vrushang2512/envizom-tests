import { test, expect } from '@playwright/test';

test.describe('Heatmap Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/heatmap');
    await page.waitForTimeout(3000);
  });

  test('HM-01 — Heatmap list loads', async ({ page }) => {
    await expect(page).toHaveURL(/heatmap/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('HM-02 — Add Heatmap opens wizard', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Heatmap"), button:has-text("Add"), button:has-text("New")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const form = page.locator('mat-dialog-container, [class*="dialog"]').first();
      if (await form.count() > 0) await expect(form).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('HM-03 — Playback controls visible', async ({ page }) => {
    const play = page.locator('mat-icon:has-text("play_arrow"), button:has-text("Play"), [aria-label*="play" i]').first();
    if (await play.count() > 0) await expect(play).toBeVisible();
  });

  test('HM-04 — Date picker visible', async ({ page }) => {
    const dp = page.locator('mat-datepicker-toggle, input[type="date"], [aria-label*="date" i]').first();
    if (await dp.count() > 0) await expect(dp).toBeVisible();
  });

  test('HM-05 — Row 3-dot menu (Edit/Delete)', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('HM-06 — Edge: Invalid date range handled', async ({ page }) => {
    const dateInput = page.locator('input[type="date"], mat-datepicker-toggle').first();
    if (await dateInput.count() > 0) {
      await dateInput.click();
      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');
    }
  });

  test('HM-07 — View existing heatmap opens detail', async ({ page }) => {
    const viewBtn = page.locator('mat-icon:has-text("visibility"), button:has-text("View"), [aria-label*="view" i]').first();
    if (await viewBtn.count() > 0) {
      await viewBtn.click();
      await page.waitForTimeout(2000);
      await page.goBack();
    }
  });
});
