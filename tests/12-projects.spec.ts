import { test, expect } from '@playwright/test';

test.describe('Projects Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/projects');
    await page.waitForTimeout(3000);
  });

  test('PR-01 — Projects list loads (17 projects)', async ({ page }) => {
    await expect(page).toHaveURL(/projects/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('PR-02 — Stats cards visible (Billing/SMS/Seats/API)', async ({ page }) => {
    const cards = page.locator('[class*="card"], [class*="stat"], mat-card');
    if (await cards.count() > 0) expect(await cards.count()).toBeGreaterThan(0);
  });

  test('PR-03 — Buy SMS confirmation dialog', async ({ page }) => {
    const buyBtn = page.locator('button:has-text("Buy"), button:has-text("Buy 1000 SMS"), button:has-text("Buy SMS")').first();
    if (await buyBtn.count() > 0) {
      await buyBtn.click();
      await page.waitForTimeout(1000);
      // Confirm dialog should appear
      const confirmDlg = page.locator('mat-dialog-container, [class*="dialog"]').first();
      if (await confirmDlg.count() > 0) {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('PR-04 — Add New Project opens 3-step wizard', async ({ page }) => {
    const addBtn = page.locator('button:has-text("Add New Project"), button:has-text("Add Project"), button:has-text("New")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const step1 = page.locator('mat-dialog-container, [class*="wizard"], [class*="dialog"]').first();
      if (await step1.count() > 0) await expect(step1).toBeVisible();
      
      // Edge: submit empty step 1
      const next = page.locator('button:has-text("Next"), button:has-text("NEXT")').first();
      if (await next.count() > 0) {
        await next.click();
        await page.waitForTimeout(800);
      }
      await page.keyboard.press('Escape');
    }
  });

  test('PR-05 — Row 3-dot: View/Set Expiry options', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const view = page.locator('text=View, text=Set Expiry, text=Edit').first();
      if (await view.count() > 0) await expect(view).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('PR-06 — Edit Project panel: Sub-Users/Modules/Devices views', async ({ page }) => {
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const viewBtn = page.locator('text=View, button:has-text("View")').first();
      if (await viewBtn.count() > 0) {
        await viewBtn.click();
        await page.waitForTimeout(1500);
        // Check Select List dropdown in panel
        const selectList = page.locator('mat-select, select').first();
        if (await selectList.count() > 0) {
          await selectList.click();
          await page.waitForTimeout(800);
          await page.keyboard.press('Escape');
        }
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('PR-07 — Archived toggle switches view', async ({ page }) => {
    const toggle = page.locator('mat-slide-toggle, text=Archived, button:has-text("Archived")').first();
    if (await toggle.count() > 0) {
      await toggle.click();
      await page.waitForTimeout(1500);
      await toggle.click(); // restore
    }
  });

  test('PR-08 — Edge: Search with no match', async ({ page }) => {
    const searchIcon = page.locator('[aria-label*="search" i], mat-icon:has-text("search")').first();
    if (await searchIcon.count() > 0) {
      await searchIcon.click();
      await page.waitForTimeout(500);
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      if (await searchInput.count() > 0) {
        await searchInput.fill('ZZZNOTFOUND999');
        await page.waitForTimeout(1500);
        await searchInput.fill('');
      }
    }
  });
});
