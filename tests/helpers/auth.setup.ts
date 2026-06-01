import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email    = process.env.ENVIZOM_EMAIL    ?? '';
  const password = process.env.ENVIZOM_PASSWORD ?? '';

  if (!email || !password) {
    throw new Error('ENVIZOM_EMAIL and ENVIZOM_PASSWORD must be set as environment variables or GitHub Secrets.');
  }

  fs.mkdirSync('playwright/.auth', { recursive: true });

  await page.goto('https://envizom.oizom.com/#/login');
  await page.waitForSelector('input[type="email"], input[formcontrolname="email"]', { timeout: 15000 });

  await page.fill('input[type="email"], input[formcontrolname="email"]', email);
  await page.fill('input[type="password"], input[formcontrolname="password"]', password);
  await page.click('button[type="submit"]');

  // Wait until redirected away from login
  await page.waitForURL(/\/#\/(overview|dashboard|cluster)/, { timeout: 20000 });

  // Never log out - if logout dialog appears, dismiss it
  page.on('dialog', async dialog => {
    if (dialog.message().toLowerCase().includes('logout') || dialog.message().toLowerCase().includes('sign out')) {
      await dialog.dismiss();
    } else {
      await dialog.dismiss();
    }
  });

  // Save the authenticated storage state
  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved to', AUTH_FILE);
});
