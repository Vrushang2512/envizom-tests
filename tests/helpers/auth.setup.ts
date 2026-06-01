import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const email    = process.env.ENVIZOM_EMAIL    ?? '';
  const password = process.env.ENVIZOM_PASSWORD ?? '';

  if (!email || !password) {
    throw new Error('ENVIZOM_EMAIL and ENVIZOM_PASSWORD must be set as environment variables or GitHub Secrets.');
  }

  // Ensure auth directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  console.log('Navigating to login page...');
  await page.goto('https://envizom.oizom.com/#/login');

  // Wait for the login form to appear
  await page.waitForSelector('input[type="email"], input[formcontrolname="email"]', { timeout: 20000 });
  console.log('Login form found, filling credentials...');

  await page.fill('input[type="email"], input[formcontrolname="email"]', email);
  await page.fill('input[type="password"], input[formcontrolname="password"]', password);

  // Click submit
  await page.click('button[type="submit"]');

  // Wait for redirect away from login — Angular hash router: /#/overview, /#/dashboard, etc.
  console.log('Waiting for login redirect...');
  await page.waitForFunction(() => {
    return !window.location.hash.includes('/login') && window.location.hash.length > 2;
  }, { timeout: 30000 });

  console.log('Login successful, URL:', page.url());

  // Extra wait for Angular to fully initialize
  await page.waitForTimeout(2000);

  // Save authenticated session
  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved to', AUTH_FILE);
});
