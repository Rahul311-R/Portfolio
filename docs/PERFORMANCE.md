# Performance — Bundle Optimization & Lighthouse Evidence

Measured on mobile emulation (Moto G-class CPU throttle, Slow 4G, Pixel-size viewport)
with the repo's own runner (`npm run lh`, 3-run median on `/`). Same tooling, same day,
only difference: the bundle graph described below. Reports land in `.lighthouseci/`
(JSON + HTML, viewable with any static server).

## Before / After — Lighthouse (mobile)

| Route | Metric | Before | After | Δ |
|---|---|---:|---:|---:|
| `/` | **Performance** | 72 | **80** | +8 |
| | LCP | 4,245 ms | **3,860 ms** | −385 ms |
| | TBT | 249 ms | **182 ms** | −27 % |
| | Transfer | 434 KB | **336 KB** | −98 KB (−23 %) |
| `/projects` | **Performance** | 68 | **81** | +13 |
| | LCP | 4,457 ms | **3,944 ms** | −513 ms |
| | TBT | 358 ms | **145 ms** | −60 % |
| | Transfer | 435 KB | **337 KB** | −98 KB |
| `/lab` | **Performance** | 75 | **82** | +7 |
| | LCP | 4,256 ms | **3,753 ms** | −503 ms |
| | TBT | 209 ms | **147 ms** | −30 % |
| | Transfer | 430 KB | **332 KB** | −98 KB |

Accessibility, Best Practices and SEO are 100 / 100 / 100 on both sides
(SEO was 91 before the `robots.txt` fix — see "Free wins" below).

## What was wrong with the "before" graph

1. **`vendor-charts` (341 KB of recharts + d3) was modulepreloaded from
   `index.html`.** Recharts is used by exactly one lazy Lab experiment
   (`DataVisExperiment`), but the manual rolldown `codeSplitting.groups` promoted
   the vendor chunk to an entry preload — so **every route on the site downloaded
   charting code it never rendered**, ahead of the images/fonts that matter.
2. **The three.js payload (895 KB min / 237 KB gzip) started downloading at Home
   mount**, i.e. during the preloader's 1.4 s window, competing with the entry
   bundle, fonts and above-the-fold rendering for the same narrow mobile pipe.
   `CinematicWorld` is the codebase's only real WebGL consumer — all other "3D"
   components are hand-rolled canvas/CSS.

## What changed

**`vite.config.ts`** — manual chunk groups are reserved for genuinely eager
vendors (`vendor-motion`, `vendor-forms`). Recharts and three.js ride natural
dynamic-import boundaries instead: the recharts code now lives in the
`DataVisExperiment` chunk (Lab-only) and is fetched nowhere else; zero manual
groups are modulepreloaded that the entry doesn't immediately need.

**`src/components/three/CinematicStage.tsx`** — the GL payload is fetched on
`requestIdleCallback` **after first paint** (2.5 s cap), and skipped entirely on
`saveData` / 2G connections, under reduced motion, without WebGL, or when the tab
is hidden. The CSS aurora fallback covers every skip path, so the stage degrades
gracefully instead of blocking anything.

A Playwright regression guard (`e2e/smoke.spec.ts`) fails CI if the three.js
chunk is ever requested before the `load` event on Home — or if it stops
arriving on idle at all.

## Entry-bundle graph (minified)

| Asset | Before | After |
|---|---|---|
| Entry JS | 287 KB | 291 KB |
| Preloaded from `index.html` | entry + vendor-charts (341 KB) + vendor-motion | entry + vendor-motion |
| recharts (347 KB) | every route | `DataVisExperiment` chunk, Lab only |
| three.js (895 KB) | fetched at Home mount | fetched on idle, post-paint |

## Free wins found during the audit

- **`robots.txt` was missing** — Lighthouse SEO reported 50 crawl errors.
  Adding the one-liner took SEO 91 → **100** on all routes.
- Remaining perf headroom is dominated by a *deliberate* design moment: the
  preloader curtain holds first paint ~1.65 s on a fresh session. LCP pays that
  cost by design; sessions after the first are unaffected
  (`sessionStorage` gate).

## Score gates (CI tripwire)

`npm run lh` fails (exit 1) if any route drops below:

| Category | Gate |
|---|---|
| Performance | ≥ 0.75 |
| Accessibility | ≥ 0.95 |
| Best Practices | ≥ 0.95 |
| SEO | ≥ 0.95 |

The perf gate is a **regression tripwire**, not an aspiration: the measured
median is ~0.80, and the "before" graph measured 0.72 / 0.68 — it fails the
gate. A future change that eagerly re-bundles three.js or charts drops 10–20
points and trips it.

## Running locally

Requires a Chrome/Chromium binary via `CHROME_PATH` (the Playwright
installation works: `ms-playwright/chromium-*/chrome-win*/chrome.exe`):

```bash
npm run build   # runner serves dist/ via vite preview
CHROME_PATH="…/chrome.exe" npm run lh
```

In CI (`.github/workflows/ci.yml`), the same runner also appends the score table
to the GitHub job summary, and `LH_HOME_RUNS` can lower the `/` run count for
quick local checks.
