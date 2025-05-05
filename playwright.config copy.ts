import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration with Strategic Test Dependencies
 *
 * This configuration organizes tests by both feature and browser.
 * The key aspect is that halloween-party and two-factor-auth tests depend on
 * navigation tests because they rely on menu links working correctly.
 *
 * If ALL navigation tests fail across ALL browsers, dependent tests won't run
 * (which makes sense - if navigation is broken, we can't reliably test
 * features that depend on navigation).
 *
 * However, if navigation tests pass in at least one browser, dependent tests
 * will still run in all browsers, giving us maximum test coverage.
 */

export default defineConfig({
  testDir: '.',
  testMatch: '**/test.ts',
  fullyParallel: true,
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1366, height: 768 },
  },

  projects: [
    {
      name: 'chrome:home-page',
      testMatch: '**/home-page/test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox:home-page',
      testMatch: '**/home-page/test.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari:home-page',
      testMatch: '**/home-page/test.ts',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'chrome:navigation',
      testMatch: '**/navigation/test.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox:navigation',
      testMatch: '**/navigation/test.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'safari:navigation',
      testMatch: '**/navigation/test.ts',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'chrome:halloween-party',
      testMatch: '**/halloween-party/test.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },
    {
      name: 'firefox:halloween-party',
      testMatch: '**/halloween-party/test.ts',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },
    {
      name: 'safari:halloween-party',
      testMatch: '**/halloween-party/test.ts',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },

    {
      name: 'chrome:two-factor-auth',
      testMatch: '**/two-factor-auth/test.ts',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },
    {
      name: 'firefox:two-factor-auth',
      testMatch: '**/two-factor-auth/test.ts',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },
    {
      name: 'safari:two-factor-auth',
      testMatch: '**/two-factor-auth/test.ts',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
    },
  ],
});
