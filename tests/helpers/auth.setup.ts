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

  // Wait for email input (CONFIRMED: input[placeholder="Email ID"])
  const emailInput = page.locator('input[placeholder="Email ID"]');
  await emailInput.waitFor({ state: 'visible', timeout: 60000 });
  await emailInput.fill(email);

  // Fill password
  await page.fill('input[placeholder="Password"]', password);

  // Log all buttons to find the correct submit button
  const buttons = await page.evaluate(() => {
    return [...document.querySelectorAll('button')].map(b => ({
      type: b.type,
      text: b.textContent?.trim()?.substring(0, 50),
      className: b.className?.substring(0, 50),
      disabled: b.disabled,
    }));
  });
  console.log('Buttons found:', JSON.stringify(buttons));

  // Try multiple button strategies for the login button
  // Material Angular buttons often don't have type="submit"
  const buttonSelectors = [
    'button[type="submit"]',
    'button:has-text("Login")',
    'button:has-text("LOGIN")',
    'button:has-text("Sign In")',
    'button:has-text("SIGN IN")',
    'button:has-text("Log In")',
    'button:has-text("LOG IN")',
    '.login-btn',
    'form button:not([type="button"])',
    'mat-button, button.mat-button, button.mat-raised-button',
    'button',  // fallback: first button on page
  ];

  let clicked = false;
  for (const sel of buttonSelectors) {
    const count = await page.locator(sel).count();
    console.log('Button selector', sel, '-> count:', count);
    if (count > 0 && !clicked) {
      try {
        await page.locator(sel).first().click({ timeout: 5000 });
        clicked = true;
        console.log('Clicked via selector:', sel);
        break;
      } catch {
        console.log('Click failed for:', sel);
      }
    }
  }

  if (!clicked) {
    throw new Error('Could not find a clickable login button');
  }

  console.log('Waiting for redirect...');
  await page.waitForFunction(
    () => !window.location.hash.includes('/login') && window.location.hash.length > 3,
    { timeout: 30000 }
  );

  console.log('Login successful! URL:', page.url());
  await page.waitForTimeout(2000);

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved.');
});
