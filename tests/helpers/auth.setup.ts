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

  await page.click('input[placeholder="Email ID"]');
  await page.keyboard.type(email, { delay: 50 });
  await page.keyboard.press('Tab');

  await page.click('input[placeholder="Password"]');
  await page.keyboard.type(password, { delay: 50 });
  await page.keyboard.press('Tab');

  await page.waitForTimeout(1000);

  await page.click('label[for="mat-mdc-checkbox-1-input"]');
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'LOG IN' }).click({ timeout: 15000 });

  await expect(page).not.toHaveURL(/login/, { timeout: 30000 });

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth setup complete - storage state saved.');
});
