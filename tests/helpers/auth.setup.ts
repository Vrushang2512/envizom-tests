import { test as setup } from '@playwright/test';
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

        // Navigate to login page and wait for it to fully load
        await page.goto('https://envizom.oizom.com/#/login', {
              waitUntil: 'networkidle',
              timeout: 60000,
        });

        // Wait for email input to be visible
        await page.waitForSelector('input[placeholder="Email ID"]', { timeout: 30000 });

        // Fill email and password using fill() - stable with Angular reactive forms
        await page.fill('input[placeholder="Email ID"]', email);
    await page.fill('input[placeholder="Password"]', password);

        // CHECK THE "I accept the Terms and Conditions" CHECKBOX
        // This checkbox is REQUIRED - the LOG IN button stays disabled without it!
        const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.waitFor({ state: 'visible', timeout: 10000 });
    const isChecked = await checkbox.isChecked();
    if (!isChecked) {
          await checkbox.click();
    }

        // Wait for Angular form validation to enable the submit button
        await page.waitForFunction(
              () => {
                      const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement | null;
                      return btn !== null && !btn.disabled;
              },
          { timeout: 15000 }
            );

        // Click the LOG IN button
        const loginBtn = page.locator('button[type="submit"]');
    await loginBtn.click({ timeout: 10000 });

        // Wait for successful login - URL should leave #/login
        await page.waitForFunction(
              () => !window.location.hash.includes('/login'),
          { timeout: 30000 }
            );

        // Save authenticated storage state
        await page.context().storageState({ path: AUTH_FILE });
    console.log('Auth setup complete - storage state saved.');
});
