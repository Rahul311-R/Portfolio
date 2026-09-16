import { test, expect, type Page } from '@playwright/test';const ROUTES = [
  // NOTE: SplitText mastheads render each word in its own span, so visible
  // text is glued together ("RAHUL R." reads as "RAHULR.") — patterns below
  // target un-spaced fragments on purpose.
  { path: '/', heading: /RAHULR\.?/i },
  { path: '/about', heading: /ABOUT/ },
  { path: '/projects', heading: /PROJECTGALLERY/i },
  { path: '/experience', heading: /EXPERIENCE/i },
  { path: '/lab', heading: /EXPERIMENTS/i },
  { path: '/resume', heading: /WEBRESUME/i },
  { path: '/contact', heading: /BUILDSOMETHING/i },
  { path: '/now', heading: /NOW/ },
  { path: '/uses', heading: /USES/ },
  { path: '/writing', heading: /WRITING/ },
  { path: '/reading', heading: /READING/ },
] as const;

/**
 * The suite runs under `prefers-reduced-motion: reduce` — which the app
 * honors globally (the MotionEngine clock drops to a gentle cadence and all
 * canvases idle). This is deliberate: it (a) makes runs deterministic on the
 * WebGL-heavy pages even under software rendering, and (b) doubles as the
 * reduced-motion parity check — every page must fully render and stay
 * error-free with animations damped.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

/** Collects console errors + uncaught page errors for the duration of `fn`. */
async function captureErrors(page: Page, fn: () => Promise<void>): Promise<string[]> {
  const errors: string[] = [];
  const onConsole = (msg: { type(): string; text(): string }) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  page.on('console', onConsole);
  page.on('pageerror', (err) => errors.push(String(err)));
  await fn();
  page.off('console', onConsole);
  return errors;
}

test.describe('route smoke', () => {
  for (const route of ROUTES) {
    test(`${route.path} renders and has no console errors`, async ({ page }) => {
      const errors = await captureErrors(page, async () => {
        await page.goto(route.path, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('main')).toBeVisible();
        // Every page mounts exactly one h1 masthead. WebGL stages boot behind
        // the preloader, so allow time for it to settle before asserting.
        await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1, {
          timeout: 20_000,
        });
        await page.waitForTimeout(300);
      });
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('404 page renders for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByText('404').first()).toBeVisible();
  });

  test('three.js payload is deferred until after first paint', async ({ page }) => {
    const worldRequests: string[] = [];
    const onRequest = (r: { url(): string }) => {
      if (/CinematicWorld/.test(r.url())) worldRequests.push(r.url());
    };
    page.on('request', onRequest);
    // Motion ON here — with reduced motion the 3D stage is skipped entirely.
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(150);
    expect(
      worldRequests,
      'the ~875KB three.js chunk was fetched before the load event — critical-path regression',
    ).toEqual([]);

    // But it must still arrive on idle, proving the stage works at all.
    await page.waitForLoadState('networkidle').catch(() => {});
    expect(worldRequests.length, 'three.js world should mount on idle').toBeGreaterThan(0);
    page.off('request', onRequest);
  });
});

test.describe('interactions', () => {
  test('project navigation: gallery → case study', async ({ page }) => {
    await page.goto('/projects', { waitUntil: 'domcontentloaded' });
    const link = page.locator('a[href^="/projects/"]').first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/projects\/[^/]+$/);
    await expect(page.locator('main')).toBeVisible();

    // Every case study renders its structured sections.
    await expect(page.locator('main').getByText(/OVERVIEW/i).first()).toBeVisible();
  });

  test('contact form validates, submits, and confirms', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    const submit = page.getByRole('button', { name: /send message/i });

    // Empty submit → validation errors surface.
    await submit.click();
    await expect(page.getByText(/at least 2 characters/i)).toBeVisible();

    // Fill → submit → validated state.
    await page.getByLabel(/your name/i).fill('Playwright Bot');
    await page.getByLabel(/your email/i).fill('bot@playwright.dev');
    await page
      .getByLabel(/message content/i)
      .fill('Hello Rahul, this is an automated end-to-end smoke test of the contact flow.');
    await submit.click();
    await expect(page.getByText('FORM VALIDATED')).toBeVisible();
  });

  test('command menu opens from the `/` hotkey and closes on Escape', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('/');
    const dialog = page.getByRole('dialog', { name: /command/i });
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('fullscreen menu reaches each primary route', async ({ page }) => {
    // "Open menu" is the fullscreen-nav trigger; "Open command menu" is a
    // different button — target precisely.
    const menuTrigger = page.getByRole('button', { name: 'Open menu' });
    for (const route of ROUTES.slice(1, 6)) {
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await menuTrigger.click();
      const dialog = page.getByRole('dialog', { name: /navigation/i });
      await expect(dialog).toBeVisible();
      await dialog.locator(`a[href="${route.path}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${route.path.replace(/\//g, '\\/')}$`));
    }
  });
});
