import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright — smoke + accessibility suite.
 *
 * The webServer runs the PRODUCTION build (`vite preview`) so e2e always
 * exercises what ships: `npm run build` once, then `npx playwright test`.
 * Tests skip automatically if the production build is missing (no silent
 * false confidence from testing a stale bundle).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : [['list', { summaryView: 'flaky' }]],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // The site is dark-first; ThemeContext seeds from prefers-color-scheme.
    // Pinning dark keeps axe scans deterministic against the canonical theme.
    colorScheme: 'dark',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
      testMatch: /responsive\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
