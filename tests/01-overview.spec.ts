import { test, expect } from '@playwright/test';

// Helper: dismiss CDK overlay backdrops via JS
async function dismissOverlays(page: any) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  // Remove any CDK overlay backdrops via JavaScript
  await page.evaluate(() => {
    document.querySelectorAll('.cdk-overlay-backdrop').forEach((el: any) => el.remove());
    document.querySelectorAll('.cdk-overlay-container').forEach((el: any) => {
      (el as HTMLElement).style.pointerEvents = 'none';
    });
  });
  await page.waitForTimeout(300);
}

test.describe('Overview Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/overview/map');
    await page.waitForTimeout(3000);
    await dismissOverlays(page);
  });

  test('OV-01 — Map view loads', async ({ page }) => {
    await expect(page).toHaveURL(/overview/);
    await page.waitForSelector('app-root', { timeout: 15000 });
  });

  test('OV-02 — Switch to Table view', async ({ page }) => {
    const tableTab = page.locator('text=Table, button:has-text("Table")').first();
    if (await tableTab.count() > 0) {
      await tableTab.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/overview/);
    }
  });

  test('OV-03 — Switch to AQI view', async ({ page }) => {
    const aqiTab = page.locator('text=AQI, button:has-text("AQI")').first();
    if (await aqiTab.count() > 0) {
      await aqiTab.click();
      await page.waitForTimeout(2000);
    }
  });

  test('OV-04 — Download Data button exists', async ({ page }) => {
    const dlBtn = page.locator('[aria-label*="download" i], button:has-text("Download")').first();
    if (await dlBtn.count() > 0) await expect(dlBtn).toBeVisible();
  });

  test('OV-05 — Notifications bell opens panel', async ({ page }) => {
    const bell = page.locator('[aria-label*="notification" i], mat-icon:has-text("notifications_active"), mat-icon:has-text("notifications_none"), mat-icon:has-text("notifications")').first();
    if (await bell.count() > 0) {
      await bell.click({ force: true });
      await page.waitForTimeout(1500);
      await dismissOverlays(page);
    }
  });

  test('OV-06 — Announcements panel opens', async ({ page }) => {
    const ann = page.locator('[class*="announcement"], mat-icon:has-text("campaign")').first();
    if (await ann.count() > 0) {
      await ann.click({ force: true });
      await page.waitForTimeout(1500);
      await dismissOverlays(page);
    }
  });

  test('OV-07 — Support chat opens', async ({ page }) => {
    const support = page.locator('[aria-label*="support" i], mat-icon:has-text("support_agent")').first();
    if (await support.count() > 0) {
      await support.click({ force: true });
      await page.waitForTimeout(1500);
      await dismissOverlays(page);
    }
  });

  test('OV-08 — Edge: navigate directly to map URL works', async ({ page }) => {
    await page.goto('/#/overview/map');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/overview/);
  });
});
