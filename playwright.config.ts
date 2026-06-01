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
  timeout: 60_000,
  globalTimeout: 15 * 60 * 1000,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://envizom.oizom.com',
    headless: true,
    viewport: { width: 1920, height: 1080 },
    screenshot: 'only-on-failure',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
    trace: 'retain-on-failure',
    // NOTE: storageState is set per-project below, NOT here globally
  },

  projects: [
    // Auth setup — runs first, creates playwright/.auth/user.json
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
      use: {
        // No storageState here — this IS the step that creates it
        storageState: undefined,
      },
    },
    // All tests — depend on setup having created the auth file
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,  // Reuse login session
      },
      dependencies: ['setup'],
    },
  ],
});
