import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email    = process.env.ENVIZOM_EMAIL    ?? '';
  const password = process.env.ENVIZOM_PASSWORD ?? '';

  if (!email || !password) {
    throw new Error('ENVIZOM_EMAIL and ENVIZOM_PASSWORD must be set.');
  }

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  await page.goto('https://envizom.oizom.com/#/login', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  await page.waitForSelector('input[placeholder="Email ID"]', { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Type credentials with keyboard to trigger Angular reactive form validation
  await page.click('input[placeholder="Email ID"]');
  await page.keyboard.type(email, { delay: 50 });
  await page.keyboard.press('Tab');

  await page.click('input[placeholder="Password"]');
  await page.keyboard.type(password, { delay: 50 });
  await page.keyboard.press('Tab');

  await page.waitForTimeout(1000);

  // Check the T&C checkbox using JavaScript evaluate
  // (Direct DOM click bypasses Angular Material's intercept issue)
  await page.evaluate(() => {
    const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
    if (checkbox && !checkbox.checked) {
      checkbox.click();
    }
  });
  await page.waitForTimeout(2000);

  // Check button state
  const btnState = await page.evaluate(() => {
    const btn = document.querySelector('button');
    return btn ? { disabled: btn.disabled, text: btn.textContent?.trim() } : null;
  });
  console.log('Button state after checkbox click:', JSON.stringify(btnState));

  // Click the LOG IN button
  if (btnState && !btnState.disabled) {
    await page.click('button');
  } else {
    // If still disabled, try force click and hope for the best
    await page.evaluate(() => {
      const btn = document.querySelector('button') as HTMLButtonElement;
      btn?.click();
    });
  }

  await expect(page).not.toHaveURL(/login/, { timeout: 30000 });

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth setup complete - storage state saved.');
});
