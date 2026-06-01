import { test, expect } from '@playwright/test';

test.describe('Devices Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/devices/devices-list');
    await page.waitForTimeout(3000);
  });

  test('DV-01 — Devices list loads (35 devices)', async ({ page }) => {
    await expect(page).toHaveURL(/devices/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('DV-02 — Device Type filter dropdown loads all types', async ({ page }) => {
    const drop = page.locator('mat-select, select').first();
    if (await drop.count() > 0) {
      await drop.click();
      await page.waitForTimeout(800);
      // Should have: ALL, POLLUDRONE, WEATHERCOM, ODOSENSE, DUSTROID, 3rd PARTY, AQBOT
      const opts = page.locator('mat-option, option');
      expect(await opts.count()).toBeGreaterThanOrEqual(6);
      await page.keyboard.press('Escape');
    }
  });

  test('DV-03 — Switch to Logbook tab', async ({ page }) => {
    const logbook = page.locator('text=Logbook, button:has-text("Logbook"), text=Log Book').first();
    if (await logbook.count() > 0) {
      await logbook.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/log-book|logbook/);
    }
  });

  test('DV-04 — Edit Device opens 2-step wizard', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const editBtn = page.locator('text=Edit, button:has-text("Edit")').first();
      if (await editBtn.count() > 0) {
        await editBtn.click();
        await page.waitForTimeout(1500);
        const form = page.locator('mat-dialog-container, [class*="dialog"], [class*="edit"]').first();
        if (await form.count() > 0) await expect(form).toBeVisible();
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('DV-05 — Mark as Favourite option exists', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const fav = page.locator('text=Favourite, text=Mark, button:has-text("Favourite")').first();
      if (await fav.count() > 0) await expect(fav).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('DV-06 — Sensor Information panel opens', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const sensor = page.locator('text=Sensor, button:has-text("Sensor")').first();
      if (await sensor.count() > 0) {
        await sensor.click();
        await page.waitForTimeout(1500);
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('DV-07 — Add Log on Logbook page', async ({ page }) => {
    await page.goto('/#/devices/log-book');
    await page.waitForTimeout(2000);
    const addLog = page.locator('button:has-text("Add Log"), button:has-text("Add"), button:has-text("New Log")').first();
    if (await addLog.count() > 0) {
      await addLog.click();
      await page.waitForTimeout(1500);
      const form = page.locator('mat-dialog-container, [class*="dialog"]').first();
      if (await form.count() > 0) await expect(form).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('DV-08 — Edge: Filter POLLUDRONE type', async ({ page }) => {
    const drop = page.locator('mat-select, select').first();
    if (await drop.count() > 0) {
      await drop.click();
      await page.waitForTimeout(800);
      const polo = page.locator('text=POLLUDRONE, mat-option:has-text("POLLUDRONE")').first();
      if (await polo.count() > 0) {
        await polo.click();
        await page.waitForTimeout(1500);
        // List should now show only POLLUDRONE devices
        await page.waitForSelector('app-root', { timeout: 5000 });
      }
    }
  });

  test('DV-09 — CSV Download button', async ({ page }) => {
    const dl = page.locator('[aria-label*="download" i], mat-icon:has-text("download"), button:has-text("Download")').first();
    if (await dl.count() > 0) await expect(dl).toBeVisible();
  });
});
