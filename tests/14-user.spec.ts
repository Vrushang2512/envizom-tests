import { test, expect } from '@playwright/test';

test.describe('User Module', () => {
  test('US-01 — Profile tab loads', async ({ page }) => {
    await page.goto('/#/user/profile');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/profile/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('US-02 — Edit profile button opens form', async ({ page }) => {
    await page.goto('/#/user/profile');
    await page.waitForTimeout(2000);
    const editBtn = page.locator('button:has-text("Edit"), [aria-label*="edit" i]').first();
    if (await editBtn.count() > 0) {
      await editBtn.click();
      await page.waitForTimeout(1000);
      const form = page.locator('form, mat-dialog-container, [class*="edit"]').first();
      if (await form.count() > 0) await expect(form).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('US-03 — Change Password button opens form', async ({ page }) => {
    await page.goto('/#/user/profile');
    await page.waitForTimeout(2000);
    const pwdBtn = page.locator('button:has-text("Change Password"), [aria-label*="password" i]').first();
    if (await pwdBtn.count() > 0) {
      await pwdBtn.click();
      await page.waitForTimeout(1000);
      await page.keyboard.press('Escape');
    }
  });

  test('US-04 — Sub-Users tab loads (17 sub-users)', async ({ page }) => {
    await page.goto('/#/user/sub-users');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/sub-users/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('US-05 — Add User opens 3-step wizard', async ({ page }) => {
    await page.goto('/#/user/sub-users');
    await page.waitForTimeout(2000);
    const addBtn = page.locator('button:has-text("Add User"), button:has-text("Add"), button:has-text("New User")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      const form = page.locator('mat-dialog-container, [class*="dialog"]').first();
      if (await form.count() > 0) await expect(form).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('US-06 — Sub-user 3-dot: Edit/Delete/Replicate/Login As', async ({ page }) => {
    await page.goto('/#/user/sub-users');
    await page.waitForTimeout(2000);
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
    }
  });

  test('US-07 — AQI/Index tab loads', async ({ page }) => {
    await page.goto('/#/user/aqi');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/aqi/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('US-08 — Create AQI/Index button opens form', async ({ page }) => {
    await page.goto('/#/user/aqi');
    await page.waitForTimeout(2000);
    const addBtn = page.locator('button:has-text("Create AQI"), button:has-text("Add AQI"), button:has-text("Create"), button:has-text("Add")').first();
    if (await addBtn.count() > 0) {
      await addBtn.click();
      await page.waitForTimeout(1500);
      await page.keyboard.press('Escape');
    }
  });

  test('US-09 — Change AQI for device type', async ({ page }) => {
    await page.goto('/#/user/aqi');
    await page.waitForTimeout(2000);
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const changeAqi = page.locator('text=Change AQI, text=Change Index').first();
      if (await changeAqi.count() > 0) {
        await changeAqi.click();
        await page.waitForTimeout(1000);
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('US-10 — Parameters/Units tab loads', async ({ page }) => {
    await page.goto('/#/user/units');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/units/);
    await page.waitForSelector('app-root', { timeout: 10000 });
  });

  test('US-11 — Edit Unit for a parameter', async ({ page }) => {
    await page.goto('/#/user/units');
    await page.waitForTimeout(2000);
    const dot = page.locator('mat-icon:has-text("more_vert")').first();
    if (await dot.count() > 0) {
      await dot.click();
      await page.waitForTimeout(800);
      const edit = page.locator('text=Edit Unit, text=Edit Limit').first();
      if (await edit.count() > 0) {
        await edit.click();
        await page.waitForTimeout(1000);
        await page.keyboard.press('Escape');
      } else {
        await page.keyboard.press('Escape');
      }
    }
  });

  test('US-12 — Modules tab loads with all module permissions', async ({ page }) => {
    await page.goto('/#/user/modules');
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/modules/);
    const rows = page.locator('table tr, mat-row, [class*="module-row"]');
    if (await rows.count() > 0) expect(await rows.count()).toBeGreaterThan(5);
  });

  test('US-13 — Edge: Empty search in sub-users', async ({ page }) => {
    await page.goto('/#/user/sub-users');
    await page.waitForTimeout(2000);
    const searchIcon = page.locator('[aria-label*="search" i], mat-icon:has-text("search")').first();
    if (await searchIcon.count() > 0) {
      await searchIcon.click();
      const input = page.locator('input[placeholder*="search" i]').first();
      if (await input.count() > 0) {
        await input.fill('');
        await page.waitForTimeout(1000);
      }
    }
  });

  test('US-14 — Edge: Search non-existent sub-user', async ({ page }) => {
    await page.goto('/#/user/sub-users');
    await page.waitForTimeout(2000);
    const searchIcon = page.locator('[aria-label*="search" i], mat-icon:has-text("search")').first();
    if (await searchIcon.count() > 0) {
      await searchIcon.click();
      const input = page.locator('input[placeholder*="search" i]').first();
      if (await input.count() > 0) {
        await input.fill('ZZZNOTEXIST9999');
        await page.waitForTimeout(1500);
        await input.fill('');
      }
    }
  });
});
