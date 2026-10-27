import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.LITSTAYS_BASE_URL || 'http://127.0.0.1:3000',
    launchOptions: { executablePath: process.env.LITSTAYS_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' },
    screenshot: 'only-on-failure',
  },
  reporter: 'list',
});
