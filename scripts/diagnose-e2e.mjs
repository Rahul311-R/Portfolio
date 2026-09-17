/**
 * Throwaway diagnostic: reproduces CI's slow-CPU conditions (12x CPU throttle,
 * reduced motion, software-ish rendering) and polls what the page is actually
 * doing while a route test would be waiting for its heading.
 *
 * Usage: node scripts/diagnose-e2e.mjs [route] [throttle]
 */
import { chromium } from '@playwright/test';

const route = process.argv[2] ?? '/uses';
const throttle = Number(process.argv[3] ?? 12);

const browser = await chromium.launch({
  args: ['--disable-gpu'],
});
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  reducedMotion: 'reduce',
  colorScheme: 'dark',
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle });

const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e}`));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 200)}`);
});

const t0 = Date.now();
await page.goto(`http://localhost:4173${route}`, { waitUntil: 'domcontentloaded' });
console.log(`goto done in ${Date.now() - t0}ms (throttle ${throttle}x)`);

for (let i = 1; i <= 15; i++) {
  await page.waitForTimeout(2000);
  const state = await page.evaluate(async () => {
    const h1s = [...document.querySelectorAll('h1')];
    const first = h1s[0];
    const rafAlive = await new Promise((res) => {
      let done = false;
      requestAnimationFrame(() => {
        done = true;
        res(true);
      });
      setTimeout(() => res(done), 3000);
    });
    return {
      reactMounted: !!document.getElementById('root')?.children.length,
      h1Count: h1s.length,
      h1Visible: first
        ? (() => {
            const s = getComputedStyle(first);
            const r = first.getBoundingClientRect();
            return { opacity: s.opacity, display: s.display, w: Math.round(r.width), h: Math.round(r.height), inA11y: first.checkVisibility?.() ?? null };
          })()
        : null,
      preloader: !!document.querySelector('[aria-hidden="true"].fixed.inset-0'),
      overflowHidden: document.documentElement.style.overflow,
      rafAlive,
      readyState: document.readyState,
      bodyChildren: document.body.children.length,
    };
  }).catch((e) => ({ evalError: String(e).slice(0, 150) }));
  console.log(`t+${((Date.now() - t0) / 1000).toFixed(0)}s`, JSON.stringify(state));
  if (state.h1Visible && state.h1Visible.inA11y) {
    console.log(`>>> HEADING VISIBLE at t+${((Date.now() - t0) / 1000).toFixed(1)}s`);
    break;
  }
}
if (errors.length) console.log('ERRORS:', errors.slice(0, 6));
await browser.close();
