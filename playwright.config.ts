import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
 
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    // Setup project: runs setup tests to create authentication storage
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/api test/**'],
      dependencies: ['setup'],
    },


    /* Dedicated project for API tests — runs once, no browser required */
    {
      name: 'api',
      testMatch: ['**/api test/**'],
    }
  ]
});
