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

        // Navigate to login page
        await page.goto('https://envizom.oizom.com/#/login', {
                waitUntil: 'networkidle',
                timeout: 60000,
        });

        // Wait for the email input to be visible
        await page.waitForSelector('input[placeholder="Email ID"]', { timeout: 30000 });

        // Fill email and password
        await page.fill('input[placeholder="Email ID"]', email);
      await page.fill('input[placeholder="Password"]', password);

        // REQUIRED: Check the "I accept the Terms and Conditions" checkbox
        // Without this the LOG IN button stays disabled
        await page.locator('input[type="checkbox"]').waitFor({ state: 'visible', timeout: 10000 });
      const isChecked = await page.locator('input[type="checkbox"]').isChecked();
      if (!isChecked) {
              await page.locator('label[for="mat-mdc-checkbox-1-input"]').click().catch(async () => {
                        // fallback: click the checkbox input directly
                                                                                              await page.locator('input[type="checkbox"]').click({ force: true });
              });
      }

        // Small wait for Angular change detection to process checkbox + form validation
        await page.waitForTimeout(1000);

        // Use Playwright's built-in enabled state check - avoids DOM null issues
        const loginBtn = page.locator('button:has-text("LOG IN")');
      await loginBtn.waitFor({ state: 'visible', timeout: 15000 });

        // Click with force so it works even if Angular marks it as disabled via CSS
        await loginBtn.click({ force: true, timeout: 10000 });

        // Wait for redirect away from login page
        await page.waitForFunction(
                () => !window.location.hash.includes('/login'),
            { timeout: 30000 }
              );

        // Save auth state
        await page.context().storageState({ path: AUTH_FILE });
      console.log('Auth setup complete - storage state saved.');
});
