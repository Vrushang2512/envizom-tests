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

  console.log('Step 1: Navigate to login page');
  await page.goto('https://envizom.oizom.com', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // If not on login, go directly
  if (!page.url().includes('/login')) {
    await page.goto('https://envizom.oizom.com/#/login', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
  }

  console.log('Step 2: URL is', page.url());

  // Take screenshot to see what actually loaded
  await page.screenshot({ path: 'test-results/login-page.png' });

  // Log all input elements found
  const inputs = await page.evaluate(() => {
    return [...document.querySelectorAll('input')].map(el => ({
      type: el.type, id: el.id, name: el.name, placeholder: el.placeholder,
      visible: el.offsetParent !== null
    }));
  });
  console.log('Inputs found:', JSON.stringify(inputs));

  // Try to find login form using broad selectors
  const emailSelectors = [
    'input[type="email"]',
    'input[formcontrolname="email"]',
    'input[name="email"]',
    'input[placeholder*="email" i]',
    'input[placeholder*="Email" i]',
    'input[type="text"]',
    'mat-form-field input',
    'form input:first-of-type',
    'input',
  ];

  let emailInput = null;
  for (const sel of emailSelectors) {
    const count = await page.locator(sel).count();
    console.log('Selector', sel, '-> count:', count);
    if (count > 0) {
      emailInput = sel;
      break;
    }
  }

  if (!emailInput) {
    await page.screenshot({ path: 'test-results/no-inputs-found.png' });
    throw new Error('Could not find any email/text input on the login page.');
  }

  console.log('Using selector:', emailInput);
  await page.fill(emailInput, email);

  // Find password input
  const pwdInput = page.locator('input[type="password"]').first();
  await pwdInput.fill(password);

  await page.screenshot({ path: 'test-results/filled-form.png' });

  // Submit
  const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("Submit")').first();
  await submitBtn.click();

  console.log('Submit clicked, waiting for redirect...');
  await page.waitForFunction(() => {
    return !window.location.hash.includes('/login') && window.location.hash.length > 2;
  }, { timeout: 30000 });

  console.log('Login successful! URL:', page.url());
  await page.waitForTimeout(3000);

  await page.context().storageState({ path: AUTH_FILE });
  console.log('Auth state saved.');
});
