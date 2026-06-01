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

  // Wait for email input (CONFIRMED: placeholder="Email ID")
  const emailInput = page.locator('input[placeholder="Email ID"]');
  await emailInput.waitFor({ state: 'visible', timeout: 60000 });

  // Clear and type to trigger Angular reactive form validation
  await emailInput.click();
  await emailInput.fill('');
  await emailInput.type(email, { delay: 50 });  // type() triggers Angular change detection

  // Fill password similarly
  const pwdInput = page.locator('input[placeholder="Password"]');
  await pwdInput.click();
  await pwdInput.fill('');
  await pwdInput.type(password, { delay: 50 });

  // Wait a moment for Angular to validate the form and enable the button
  await page.waitForTimeout(1000);

  // Log button state after filling
  const btnState = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    return btn ? { disabled: (btn as HTMLButtonElement).disabled, text: btn.textContent?.trim() } : null;
  });
  console.log('Button state after fill:', JSON.stringify(btnState));

  // CONFIRMED button text: "LOG IN" - use force click to bypass disabled state if needed
  const loginBtn = page.locator('button[type="submit"]');
  
  try {
    // First try normal click (button should be enabled after proper form fill)
    await loginBtn.click({ timeout: 5000 });
    console.log('Clicked LOG IN button normally');
  } catch {
    console.log('Normal click failed, trying force click...');
    await loginBtn.click({ force: true, timeout: 5000 });
    console.log('Force clicked LOG IN button');
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
