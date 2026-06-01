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

  // Navigate with networkidle to ensure Angular fully loads
  await page.goto('https://envizom.oizom.com', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });

  // If not redirected to login, navigate directly
  if (!page.url().includes('/login')) {
    await page.goto('https://envizom.oizom.com/#/login', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
  }

  console.log('URL:', page.url());

  // CONFIRMED from CI: email field is input[placeholder="Email ID"] (type=text, not email)
  // Wait for it to be visible
  const emailInput = page.locator('input[placeholder="Email ID"]');
  await emailInput.waitFor({ state: 'visible', timeout: 60000 });

  await emailInput.fill(email);
  await page.fill('input[placeholder="Password"], input[type="password"]', password);

  await page.click('button[type="submit"]');
  console.log('Clicked submit, waiting for redirect...');

  // Wait until URL changes away from /login
  await page.waitForFunction(
    () => !window.location.hash.includes('/login') && window.location.hash.length > 3,
    { timeout: 30000 }
  );

  console.log('Logged in! URL:', page.url());
  await page.waitForTimeout(2000);

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved.');
});
