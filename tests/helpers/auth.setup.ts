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

  // Ensure auth directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  console.log('Navigating to login page...');

  // Navigate with domcontentloaded wait (faster than load for Angular SPAs)
  await page.goto('https://envizom.oizom.com/#/login', {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });

  // Give Angular time to bootstrap (important on cold CI runners)
  await page.waitForTimeout(5000);

  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());

  // Wait for email input — extended timeout for CI cold start
  console.log('Waiting for login form...');
  await page.waitForSelector(
    'input[type="email"], input[formcontrolname="email"], input[type="text"]',
    { timeout: 60000, state: 'visible' }
  );

  console.log('Login form found, filling credentials...');
  await page.fill('input[type="email"], input[formcontrolname="email"]', email);
  await page.fill('input[type="password"], input[formcontrolname="password"]', password);

  // Take screenshot before submit for debugging
  await page.screenshot({ path: 'test-results/login-before-submit.png' });

  // Click submit
  await page.click('button[type="submit"]');
  console.log('Submit clicked, waiting for redirect...');

  // Wait for Angular router to navigate away from login
  await page.waitForFunction(() => {
    return !window.location.hash.includes('/login') && window.location.hash.length > 2;
  }, { timeout: 30000 });

  console.log('Login successful! URL:', page.url());

  // Extra wait for Angular to fully initialize
  await page.waitForTimeout(3000);

  // Save authenticated session
  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved to', AUTH_FILE);
});
