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

        // Navigate to the login page
        await page.goto('https://envizom.oizom.com/#/login', {
                    waitUntil: 'networkidle',
                    timeout: 60000,
        });

        // Wait for the email input to appear
        await page.waitForSelector('input[placeholder="Email ID"]', { timeout: 30000 });
          await page.waitForTimeout(1000);

        // Fill in email and password
        await page.fill('input[placeholder="Email ID"]', email);
          await page.fill('input[placeholder="Password"]', password);

        // CRITICAL: Check the "I accept Terms & Conditions" checkbox.
        // Angular Material removes the button's type="submit" when button is disabled,
        // so we use button text selector "LOG IN" instead of type="submit".
        await page.locator('mat-checkbox').click();
          await page.waitForTimeout(2000);

        // Click the LOG IN button using text (not type="submit" which disappears when enabled)
        await page.getByRole('button', { name: 'LOG IN' }).click({ timeout: 15000 });

        // Wait for redirect away from login page
        await expect(page).not.toHaveURL(/login/, { timeout: 30000 });

        // Save the authenticated session state
        await page.context().storageState({ path: AUTH_FILE });
          console.log('Auth setup complete - storage state saved.');
});
