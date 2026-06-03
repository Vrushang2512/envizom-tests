import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const AUTH_FILE = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 90_000, // 90s per test (auth needs up to 60s alone)
  globalTimeout: 23 * 60 * 1000, // 23 minutes (allows for 52 tests with video recording)

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://envizom.oizom.com',
    headless: false,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
    trace: 'retain-on-failure',
    actionTimeout: 30_000, // 30s for each action (click, fill etc)
    navigationTimeout: 60_000, // 60s for navigation
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      timeout: 120_000, // 2 minutes for auth setup
      use: {
        storageState: undefined,
        actionTimeout: 30_000,
        navigationTimeout: 60_000,
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
    },
  ],
});
