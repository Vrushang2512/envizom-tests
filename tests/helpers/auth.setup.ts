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

        // Navigate to login page
        await page.goto('https://envizom.oizom.com/#/login', {
                  waitUntil: 'networkidle',
                  timeout: 60000,
        });

        // Wait for form to load
        await page.waitForSelector('input[placeholder="Email ID"]', { timeout: 30000 });
        await page.waitForTimeout(1000);

        // Fill credentials
        await page.fill('input[placeholder="Email ID"]', email);
        await page.fill('input[placeholder="Password"]', password);

        // Check Terms & Conditions checkbox - REQUIRED to enable LOG IN button
        const checkbox = page.locator('input[type="checkbox"]');
        await checkbox.waitFor({ state: 'visible', timeout: 10000 });
        if (!await checkbox.isChecked()) {
                  // Click the visible checkbox label/element
          await page.locator('mat-checkbox').click();
                  await page.waitForTimeout(500);
        }

        // Wait 2 seconds for Angular to process form validation after checkbox
        await page.waitForTimeout(2000);

        // The button text is "LOG IN" - click it with retries
        // Use page.click with normal (non-force) click to properly trigger Angular
        await page.click('button[type="submit"]', { timeout: 15000 });

        // Wait for navigation away from login page
        await expect(page).not.toHaveURL(/login/, { timeout: 30000 });

        // Save auth storage state
        await page.context().storageState({ path: AUTH_FILE });
        console.log('Auth setup complete - storage state saved.');
});
