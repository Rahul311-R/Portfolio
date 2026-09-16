import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

/**
 * Accessibility gates, run under `prefers-reduced-motion: reduce` (see
 * smoke.spec.ts): the a11y audit must pass in the app's most conservative
 * state. Bar: ZERO serious/critical violations on every main route.
 */
const ROUTES = ['/', '/about', '/projects', '/experience', '/lab', '/resume', '/contact', '/now', '/uses', '/writing', '/reading'];

const RULES = [
  'color-contrast',
  'button-name',
  'link-name',
  'label',
  'aria-valid-attr',
  'aria-allowed-attr',
  'aria-required-children',
  'aria-roles',
  'duplicate-id',
  'empty-heading',
  'html-has-lang',
  'image-alt',
  'nested-interactive',
];

async function scan(page: import('@playwright/test').Page, route: string) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.getByRole('heading').first().waitFor({ state: 'visible', timeout: 20_000 });
  await page.waitForTimeout(250);
  return new AxeBuilder({ page }).withRules(RULES).analyze();
}

test.describe('accessibility', () => {
  for (const route of ROUTES) {
    test(`${route} has no serious or critical violations`, async ({ page }) => {
      const results = await scan(page, route);
      const severe = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      let summary = '';
      if (severe.length > 0) {
        summary = severe
          .map(
            (v) =>
              `${v.id} [${v.impact}] (${v.nodes.length} nodes): ${v.nodes
                .slice(0, 3)
                .map((n) => n.target.join(' '))
                .join(' | ')}`,
          )
          .join('\n');
        console.log(`\n[axe] ${route}:\n${summary}`);
      }
      expect(severe, summary).toEqual([]);
    });
  }

  test('fullscreen navigation menu is accessible when open', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const dialog = page.getByRole('dialog', { name: /navigation/i });
    await expect(dialog).toBeVisible();
    // Let the clip-path intro + staggered item reveals finish before scanning;
    // axe samples computed styles and mid-animation fades read as low contrast.
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast', 'button-name', 'link-name', 'aria-roles', 'aria-valid-attr'])
      .analyze();
    const severe = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    const summary = severe.map((v) => v.id).join(', ');
    expect(severe, summary).toEqual([]);
  });

  test('command menu is accessible when open', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('/');
    const dialog = page.getByRole('dialog', { name: /command/i });
    await expect(dialog).toBeVisible();
    await dialog.locator('input').focus();
    await page.waitForTimeout(400); // entrance transition

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast', 'button-name', 'link-name', 'aria-roles', 'aria-valid-attr'])
      .analyze();
    const severe = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    const summary = severe.map((v) => v.id).join(', ');
    expect(severe, summary).toEqual([]);
  });
});
