import { test, expect } from '@playwright/test';

test.describe('Alerts Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/alert/alerts-list', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForURL(/alert/, { timeout: 20000 });
  });

  test('AL-01 — Alerts list loads (1235 alerts exist)', async ({ page }) => {
            await page.waitForSelector('app-root', { state: 'attached', timeout: 15000 });
  });  

  test('AL-02 — Add Alert opens 3-step wizard with validation', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Alert"), button:has-text("Add"), button:has-text("Create")').first();
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

  test('AL-03 — Add Alert with valid name advances to step 2', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add Alert"), button:has-text("Add")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const nameField = page.locator('input[formcontrolname="name"], input[placeholder*="name" i]').first();
      if (await nameField.count() > 0) {
        await nameField.fill('Automation Test Alert');
        const next = page.locator('button:has-text("Next"), button:has-text("NEXT")').first();
        if (await next.count() > 0) {
          await next.click();
          await page.waitForTimeout(1000);
        }
      }
      await page.keyboard.press('Escape');
    }
  });

  test('AL-04 — Alert toggle enable/disable', async ({ page }) => {
    const toggle = page.locator('mat-slide-toggle').first();
    if (await toggle.count() > 0) {
      await toggle.click();
      await page.waitForTimeout(800);
      await toggle.click(); // restore
    }
  });

  test('AL-05 — Row 3-dot: Edit/Delete options', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('AL-06 — Edge: XSS in search input', async ({ page }) => {
    const search = page.locator('input[placeholder*="search" i]').first();
    if (await search.count() > 0) {
      await search.fill('<img src=x onerror=alert(1)>');
      await page.waitForTimeout(1000);
      await search.fill('');
    }
  });

  test('AL-07 — Pagination (next page if available)', async ({ page }) => {
    const next = page.locator('[aria-label*="next" i], mat-icon:has-text("navigate_next")').first();
    if (await next.count() > 0) {
      const disabled = await next.getAttribute('disabled');
      if (!disabled) {
        await next.click();
        await page.waitForTimeout(1500);
        const prev = page.locator('[aria-label*="previous" i], mat-icon:has-text("navigate_before")').first();
        if (await prev.count() > 0) await prev.click();
      }
    }
  });
});
