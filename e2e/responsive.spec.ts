import { test, expect } from '@playwright/test';

/**
 * Responsive gates, pinned to the small end of the device matrix, run under
 * `prefers-reduced-motion: reduce` for determinism (see smoke.spec.ts).
 * Bar: zero horizontal scroll and reachable navigation at 360px — the
 * narrowest mainstream Android viewport (the file also runs on the
 * mobile-chromium project at Pixel 7 dimensions).
 */
const ROUTES = ['/', '/about', '/projects', '/lab', '/resume', '/contact'];

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const width of [360, 390]) {
  test.describe(`no horizontal scroll @ ${width}px`, () => {
    for (const route of ROUTES) {
      test(`${route} fits viewport width`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(300);

        const scrollWidth = await page.evaluate(
          () => document.documentElement.scrollWidth,
        );
        const clientWidth = await page.evaluate(
          () => document.documentElement.clientWidth,
        );
        expect(
          scrollWidth,
          `page overflows by ${scrollWidth - clientWidth}px`,
        ).toBeLessThanOrEqual(clientWidth + 1); // 1px tolerance for sub-pixel rounding
      });
    }
  });
}

test.describe('mobile interactions', () => {
  test('fullscreen menu opens and navigates at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog', { name: /navigation/i });
    await expect(dialog).toBeVisible();

    await dialog.locator('a[href="/projects"]').first().click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test('primary controls meet the 44px touch-target guideline', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const menuButton = page.getByRole('button', { name: 'Open menu' });
    await menuButton.scrollIntoViewIfNeeded();

    const box = await menuButton.boundingBox();
    expect(box, 'menu trigger has a bounding box').not.toBeNull();
    expect(
      box!.height,
      `menu trigger height ${box!.height}px is below the 44px guideline`,
    ).toBeGreaterThanOrEqual(44);
  });
});
