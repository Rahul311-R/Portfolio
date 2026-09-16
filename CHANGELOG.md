# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### GitHub Actions CI pipeline

#### Added
- `.github/workflows/ci.yml` running on every push to `main` and every PR, three parallel jobs on `ubuntu-latest` (Node 24, npm cache):
  - **verify** — `npm run ci` (oxlint → strict typecheck → 32 Vitest specs → production build), uploads `dist/` as an artifact;
  - **e2e** — all 58 Playwright specs (chromium + mobile-chromium) against the production build, with report/test-results artifacts on failure;
  - **lighthouse** — gated mobile audits via `npm run lh` with `CHROME_PATH=/usr/bin/google-chrome`, reports uploaded on every outcome.
- `scripts/lighthouse.mjs` now appends a markdown score table (✅/❌ per category vs. gates, plus LCP/TBT/CLS/transfer) to `$GITHUB_STEP_SUMMARY` when set — the Lighthouse job renders it in the Actions run's Summary tab; `LH_HOME_RUNS` env override for local runs.
- README badge switched to the live GitHub Actions workflow badge.

### Lighthouse CI: mobile score gates + measured before/after evidence

#### Added
- `scripts/lighthouse.mjs` + `npm run lh`: serves the production build via `vite preview`, drives the `lighthouse` programmatic API against a self-launched headless Chrome (bypasses chrome-launcher's Windows temp-profile EPERM), and enforces score gates in code — perf ≥ 0.75 (regression tripwire), a11y ≥ 0.95, best-practices ≥ 0.95, seo ≥ 0.95. Three runs of `/` (median gated) plus `/projects` and `/lab`; JSON + HTML reports in `.lighthouseci/` (gitignored). Requires `CHROME_PATH`.
- `docs/PERFORMANCE.md`: measured before/after Lighthouse table for the bundle-graph optimization (home perf 72 → 80, LCP −385ms, transfer −98KB per route; "before" re-measured under identical tooling and fails the new tripwire gate), entry-bundle graph, and gate rationale.
- README badges (CI, e2e, axe, Lighthouse) and a Performance section linking the doc.

#### Fixed
- Added `public/robots.txt` — Lighthouse SEO reported 50 crawl errors without it; SEO category 91 → 100 on all audited routes.

### Bundle: three.js out of the critical path

#### Changed
- `CinematicStage` now defers the ~875KB (237KB gzip) three.js `CinematicWorld` chunk until after first paint (`requestIdleCallback`, 2.5s cap; skipped on `saveData`/2G connections), so Home's first paint never waits for WebGL.
- Manual `codeSplitting.groups` trimmed to eager vendors only (framer-motion, forms). Recharts (347KB, used by one lazy Lab experiment) and three.js are no longer grouped — manual groups are modulepreloaded from `index.html`, which previously pulled 341KB of charts into every page's initial load.
- Added an e2e regression guard asserting the three.js chunk is not fetched before the `load` event on Home.

#### Result
- Initial load on `/`: no charts, no three.js, no `vendor-forms` preload. Entry 287→291KB (Light/Dark + router + UI kit); everything else rides dynamic-import boundaries.

### Phase 1 — Testability & measured responsiveness (docs/COMPETITION-SCORING-PLAN.md)

#### Added
- Unit test stack: Vitest + Testing Library (+ jest-dom), 32 tests across hooks (`useInView`), lib guards (`smoothScroll`), the contact zod schema (extracted to `src/lib/schemas/contact.ts`), data invariants, and `ContactForm`/`Marquee` components. Shared jsdom polyfills (IntersectionObserver/ResizeObserver/matchMedia) in `src/test/`.
- E2E suite: Playwright + axe-core, 57 specs — route smoke with zero-console-error gates, axe serious/critical = 0 on 11 routes + both overlay menus, no horizontal scroll at 360/390px, 44px touch-target floor, Pixel 7 profile.
- Scripts: `test`, `test:watch`, `e2e`; `ci` now runs lint + typecheck + unit tests + build.

#### Fixed (axe-driven accessibility fixes)
- Contrast: new `--accent-ink` token replaces white-on-gold fills across 11 components (dark mode uses dark ink on gold; light mode uses white); amber-400 text moved to a `gold-300` token; low-opacity white labels (35–50%) raised to ≥55%; `--accent-color` darkened in light mode to clear AA.
- Naming/labels: command-menu close button got an accessible name; hue range input labeled; `aria-pressed` removed from `role="tab"` elements.
- Touch: fullscreen-menu trigger raised to the 44px guideline.

### Phase 0 — Hygiene & evidence hooks (docs/COMPETITION-SCORING-PLAN.md)

#### Added
- Strict TypeScript: `strict` and `noUncheckedIndexedAccess` enabled in `tsconfig.app.json`, with all call-site fallout fixed across 17 files.
- `@/` path alias for `src/` (vite `resolve.alias` + tsconfig `paths`); all 56 files migrated off relative `../` imports.
- Open Graph / Twitter card: `public/og-card.svg` (Transmission-series source) rasterized to `public/og.png` (1200×630) via `npm run og` (`scripts/generate-og.mjs`, sharp).
- Social meta: `og:image`, dimensions, alt, and `summary_large_image` Twitter card.
- `LICENSE` (MIT) and this `CHANGELOG.md`.
- `npm run ci` aggregate verify script (lint → typecheck → build).

#### Changed
- Font loading moved from a render-blocking CSS `@import` (Google Fonts) to `<head>` `preconnect` + stylesheet link; consolidated to variable-weight ranges (`wght@300..700` etc.) with fewer variants.
- `README.md` run instructions updated for the new scripts.

[keepachangelog]: https://keepachangelog.com/en/1.1.0/
