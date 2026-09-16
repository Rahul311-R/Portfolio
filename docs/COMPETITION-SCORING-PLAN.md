# Competition Scoring Plan — Portfolio × Rubric Alignment

Tailored to this codebase: **React 19 + TypeScript 6 + Vite 8 (rolldown) + Tailwind v4 + Framer Motion 13 + three/R3F + Recharts + RHF/Zod + Lenis**, ~8.9k LOC, 13 routes, 7 lab experiments, 11 three.js components, shared `MotionEngine`, "Transmission" generative SVG system, command palette, Konami terminal, light/dark + 4 accent themes, manual reduced-motion toggle.

**Rubric:** Design Innovation & Visual Aesthetics (35) · Code Architecture & Cleanliness (25) · Mobile & Device Responsiveness (20) · Creative Animations & User Delight (20) — **100 total.**

---

## 0. Self-audit: where points are won/lost today

| Category | Current est. | Target | Biggest gap |
|---|---|---|---|
| Aesthetics (35) | ~26 | 33 | No documented design system; no OG/social image; type scale not fluid-documented |
| Architecture (25) | ~12 | 23 | **Zero tests**, `strict` TS off, no aliases, no CI, empty `src/utils`, dead code unmeasured |
| Responsiveness (20) | ~13 | 19 | No measured evidence (Lighthouse/mobile), canvas DPR unclamped, fonts render-block, tap targets unaudited |
| Delight (20) | ~15 | 19 | Micro-interactions inconsistent (no inventory), no sound/haptics/View-Transitions layer |

**Strategic read:** Aesthetics and Delight are already near-ceiling; the cheapest points on the board are in **Architecture (13 pts of headroom)** and **Responsiveness evidence (6–7 pts)** — i.e., tooling + strictness + measurement, not new features.

### Assets already earning points (protect them)
- `src/engine/MotionEngine.tsx` — one rAF clock shared by every canvas (a genuine architecture story judges can see).
- 16 hand-authored generative SVGs with a documented coherence spec (`docs/VISUAL-ENHANCEMENT-PLAN.md`) — "design system" evidence.
- 141 `prefers-reduced-motion` touchpoints, 83 `aria-*` usages, `aria-hidden` on decorative canvases.
- Lazy routes + manual vendor code-split groups in `vite.config.ts`; `ErrorBoundary`; per-page `PageMeta`.

### Issues found in audit (fix = points)
1. **No tests at all** (repo has 0 test files; no vitest/playwright in `node_modules`).
2. `tsconfig.app.json` has **no `strict: true`** (and no `noUncheckedIndexedAccess`).
3. Fonts loaded via **CSS `@import` of Google Fonts** → serial render-blocking chain; 4 families × weights is heavy.
4. All imports are relative (`../../hooks/useReducedMotion`) — no `@/` aliases; refactors are fragile.
5. No CI, no Lighthouse/axe evidence, no `LICENSE`, no `CHANGELOG.md`, empty `src/utils`.
6. Canvas 2D/3D DPR policy unverified (high-DPI phones can render 3× pixels).

---

## 1. Feature → Rubric Mapping

### 1.1 Design Innovation & Visual Aesthetics (35)

| Rubric sub-criterion | Existing feature that scores | Addition needed |
|---|---|---|
| Cohesive visual identity | "Transmission" motif: per-page SVG series + `SIG nn` captions + gold/violet token palette | `docs/DESIGN-SYSTEM.md`: tokens, type scale, spacing rhythm, one page showing the rules |
| Layout craft & hierarchy | `PageMasthead`, `SectionMarker` + gold hairlines, `ArtifactPlate` framed plates | Fluid type scale via `clamp()` tokens; 12-col grid alignment audit on Home/About |
| Color system sophistication | Light/dark + 4 accent themes, all via CSS variables | WCAG AA contrast matrix for every token pair (automatable script) |
| Imagery quality | 16 generative SVGs (1.5–3 KB each, zero raster) | Branded 1200×630 `og:image`; favicon/social set; polished `README` screenshots |
| Signature moment | Hero `SignalCore3D` reactor + Preloader + Command palette | **Print stylesheet for `/resume`** (rare, cheap, memorable polish) |
| Detail finishing | `grain` texture layer, `page-halo`, `.signal-rule`, custom scrollbar | Selection color, focus ring token, 404 + error states styled (404 exists; keep) |

### 1.2 Code Architecture & Cleanliness (25)

| Rubric sub-criterion | Existing | Addition needed |
|---|---|---|
| Modularity & separation | Layered dirs (`ui/layout/three/transmission/lab/forms/hero/home`, `engine`, `hooks`, `context`, `data`, `pages`) | `@/` path aliases; extract pure logic from canvases into `src/lib/*` (testable units) |
| Type safety | TS everywhere, `verbatimModuleSyntax`, `noUnusedLocals` | **`strict: true` + `noUncheckedIndexedAccess`** — single biggest cleanliness win |
| Testing | — | Vitest (unit) + Testing Library (components) + Playwright (e2e) + axe; ~25 unit + 5 e2e minimum |
| Tooling & automation | oxlint, `tsc -b && vite build` | GitHub Actions: lint → typecheck → test → build → Lighthouse; `npm run ci` aggregate |
| Documentation | README + `VISUAL-ENHANCEMENT-PLAN.md` | `docs/ARCHITECTURE.md` (with mermaid diagram), `docs/TESTING.md`, JSDoc on public APIs |
| Hygiene | — | knip sweep (unused exports), delete empty `src/utils`, conventional commits, LICENSE, CHANGELOG |

### 1.3 Mobile & Device Responsiveness (20)

| Rubric sub-criterion | Existing | Addition needed |
|---|---|---|
| Layout adaptation | Tailwind responsive classes throughout; `FullscreenMenu` for mobile nav | Breakpoint audit at 360/390/768/1024/1440/1920 — fix any horizontal scroll at 360px |
| Touch ergonomics | `Coverflow3D` degrades to snap carousel; `aria-pressed` toggles | ≥44×44px targets everywhere; `@media (hover: hover)` guards on hover-only affordances |
| Performance on devices | Lazy routes, `LazyMount` (offscreen mount), vendor splitting | **DPR clamp ≤2** on every canvas; pause rAF when tab hidden; font self-hosting; ≤300KB gzip initial JS budget |
| Adaptive capability | Reduced-motion + `MotionToggle` | Scale 3D particle counts by `navigator.hardwareConcurrency` / coarse pointer |
| Evidence | — | Lighthouse CI mobile preset (≥95 perf/a11y) run in CI; device-matrix screenshots (iOS Safari, Android Chrome) |

### 1.4 Creative Animations & User Delight (20)

| Rubric sub-criterion | Existing | Addition needed |
|---|---|---|
| Motion architecture | `MotionEngine` shared clock; `AmbientField`; scroll-velocity-aware canvases | Centralized variants factory (`src/lib/motion.ts`) so all Framer Motion uses one easing/duration language |
| Micro-interactions | `TiltCard`, `MagneticButton`, `CountUp`, `SplitText`, `Marquee`, `Cursor` | **Micro-interaction inventory**: every link/button/has hover + active + focus-visible state |
| Narrative/scroll delight | `Scroll3D`, `WarpDivider`, `SignalBus`, Lenis smooth scroll | Choreographed Home reveal (staggered, scroll-linked) as a single composed sequence |
| Easter eggs | Konami terminal, `/` command palette | WebAudio **sound toggle** (default off, persisted); `navigator.vibrate` haptics on lab interactions |
| Progressive enhancement | `PageTransition` (Framer) | **View Transitions API** via React Router 7 `viewTransition` prop — additive, respects reduced motion |
| Respect for the user | Reduced-motion slow-clock instead of freeze | Automated e2e asserting reduced-motion parity (no runaway animations with toggle on) |

---

## 2. Concrete improvements (with rationale + code)

### 2.1 UI/UX polish

**F1 — Kill the render-blocking font `@import`** *(perf + mobile + aesthetics)*
The CSS `@import` serializes: HTML → CSS → font CSS → fonts. Move to `<head>` with preconnect (quick win), or self-host variable fonts for offline dev/e2e stability:

```html
<!-- index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400..600&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..700&family=Space+Grotesk:wght@400..900&display=swap" />
```
Then delete line 1 of `src/index.css`. *Better:* `npm i @fontsource-variable/inter @fontsource-variable/space-grotesk @fontsource-variable/jetbrains-mono` and import in `main.tsx` — subset, cacheable, works offline.

**F2 — Fluid type scale tokens** *(aesthetics, eliminates per-breakpoint font fiddling)*
```css
/* index.css — Tailwind v4 theme layer */
@theme {
  --text-display: clamp(2.25rem, 5vw + 1rem, 4.5rem);  /* → text-display */
  --text-title: clamp(1.5rem, 2.5vw + 1rem, 2.5rem);
}
```

**F3 — Focus ring as a designed token** *(aesthetics + a11y in one move)*
```css
:root { --focus-ring: 0 0 0 2px var(--bg-primary), 0 0 0 4px var(--accent-color); }
:focus-visible { outline: none; box-shadow: var(--focus-ring); border-radius: 4px; }
```

**F4 — Print stylesheet for `/resume`** *(differentiator judges notice)*
```css
@media print {
  .grain, .grain ~ *, nav, footer, canvas { display: none !important; }
  main { color: #000; background: #fff; }
  a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.8em; }
}
```

**F5 — Social/OG card**: 1200×630 SVG-derived PNG at `public/og.png` + `<meta property="og:image">` in `index.html`. Judges share links; a naked link card reads unfinished.

### 2.2 Architecture, modularity, testing

**F6 — Enable strict TS** *(the single highest-leverage cleanliness change)*
```jsonc
// tsconfig.app.json → compilerOptions
"strict": true,
"noUncheckedIndexedAccess": true,
```
Expect a burst of fixable errors (array indexing, possibly-null refs). Land in one focused commit; CI green afterwards is permanent proof.

**F7 — Path aliases** *(module hygiene; makes extraction/renames trivial)*
```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // ...existing
});
```
```jsonc
// tsconfig.app.json
"paths": { "@/*": ["./src/*"] }
```

**F8 — Testing stack** *(worth ~8–10 rubric points across two categories)*
```bash
npm i -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test @axe-core/playwright
```
```ts
// vite.config.ts (add)
test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.ts' },
```
```ts
// src/components/ui/Marquee.test.tsx — example unit test
import { render, screen } from '@testing-library/react';
import { Marquee } from './Marquee';

it('renders every item exactly once in DOM', () => {
  render(<Marquee items={['AI', 'DATA', 'CODE']} label="Stack" />);
  expect(screen.getAllByText('AI').length).toBeGreaterThanOrEqual(1);
});
```
```ts
// e2e/a11y.spec.ts — axe audit per route, plus reduced-motion parity
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/', '/about', '/projects', '/lab', '/contact', '/resume'];
for (const route of routes) {
  test(`${route} has no critical axe violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toEqual([]);
  });
}
```
Priority unit targets: `hooks/*`, `lib/smoothScroll` guards, zod schemas in `ContactForm`, extracted physics helpers, `data/*.ts` shape validation.

**F9 — CI pipeline** *(turns "we have tests" into "evidence")*
```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint -- --deny-warnings
      - run: npx tsc -b
      - run: npx vitest run
      - run: npm run build
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci && npx playwright install --with-deps chromium
      - run: npx playwright test
```

**F10 — Extract pure logic from canvases.** The three.js/2D components currently own math + rendering + lifecycle. Moving orbit math, packet lanes, terrain noise into `src/lib/` yields testable modules *and* reads as textbook separation of concerns. Do it opportunistically for 3 components — not all.

### 2.3 Responsive layout & accessibility

**F11 — Clamp devicePixelRatio on every canvas** *(biggest mobile GPU win)*
```ts
const dpr = Math.min(window.devicePixelRatio || 1, 2);
canvas.width = Math.round(rect.width * dpr);
canvas.height = Math.round(rect.height * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
```
For R3F canvases: `<Canvas dpr={[1, 2]} …>`. Also scale particle counts: `const budget = matchMedia('(pointer: coarse)').matches ? 0.6 : 1;`

**F12 — Tap-target sweep**: every interactive control ≥ `min-h-11 min-w-11` (44px). Grep for `h-8 w-8`/`h-9 w-9` buttons and pad. Playwright/axe catches many of these automatically (`target-size` rule).

**F13 — Breakpoint audit checklist** (record in `docs/ACCESSIBILITY.md` as a table): 360 / 390 / 768 / 1024 / 1440 / 1920 — no horizontal scroll, nav usable, canvases resize via `ResizeObserver` (verify each MotionEngine subscriber re-reads rect on resize).

**F14 — Pause all rAF work when tab hidden**: in `MotionEngine`, gate the loop on `document.visibilityState === 'visible'` (battery + perf on mobile).

**F15 — Color tokens must pass AA in *both* themes × 4 accents.** Small node script that reads `:root`/`html.light` variables and computes contrast ratios; output the matrix into `docs/ACCESSIBILITY.md` as evidence.

### 2.4 Animations & micro-interactions

**F16 — Central motion language** *(consistency is what separates "has animations" from "designed motion")*
```ts
// src/lib/motion.ts
import type { Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // easeOutQuint-ish

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
  }),
};

export const stagger = (n: number) => ({ show: { transition: { staggerChildren: n } } });
```
Migrate `Animations.tsx` primitives to consume these — one easing/duration vocabulary site-wide.

**F17 — View Transitions (React Router 7 native)**
```tsx
<Link to="/about" viewTransition>About</Link>
```
```css
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(root) { animation: vt-out 200ms ease-in both; }
  ::view-transition-new(root) { animation: vt-in 260ms ease-out both; }
}
@keyframes vt-out { to { opacity: 0; transform: translateY(-8px); } }
@keyframes vt-in  { from { opacity: 0; transform: translateY(10px); } }
```
Use *either* View Transitions *or* `PageTransition` per route — not both. Ship behind one flag, verify reduced motion collapses it.

**F18 — Sound toggle (default off, persisted)**: tiny WebAudio synth — a soft "tick" on command-palette open, low blip on lab interactions. ~40 LOC in `src/lib/audio.ts`, wired like `MotionToggle` (reuse the exact `aria-pressed` pattern). High delight-per-LOC; default-off keeps it professional.

**F19 — Haptics on lab interactions**
```ts
export const buzz = (ms = 10) => { if ('vibrate' in navigator) navigator.vibrate(ms); };
```
Call on brush-stroke start, orbit drag start, palette open. Android-only effect; zero cost elsewhere.

**F20 — Home choreography pass**: one scroll-linked sequence — masthead splits in → hero reactor ignites → transmission band tiles stagger → metrics count up — all driven by the existing `fadeUp` variants + Lenis scroll position. Rehearse it like a 10-second film; that's the judges' first impression.

---

## 3. MVP & phased roadmap

### Phase 0 — Hygiene & evidence hooks (~1 day) ← *do first*
| Task | Score impact |
|---|---|
| F6 `strict: true` + fix fallout | Architecture |
| F7 aliases | Architecture |
| F1 font loading fix | Mobile + Perf |
| F5 og:image/favicon set | Aesthetics |
| LICENSE, CHANGELOG, README scripts table | Architecture |
| `npm run ci` aggregate script | enables everything below |

### Phase 1 — MVP (days 2–4): *testability + measured responsiveness*
1. F8 Vitest + Testing Library; unit tests for hooks/lib/schemas (≥20 green).
2. F8 Playwright e2e: 6-route smoke + axe serious/critical = 0.
3. F9 GitHub Actions CI (lint, typecheck, test, build, e2e).
4. Lighthouse CI config (`@lhci/cli`, mobile preset, `startServerCommand: npm run preview`, thresholds: perf ≥ 0.9, a11y ≥ 0.95, best-practices ≥ 0.95, SEO ≥ 0.9).
5. F12 tap-target sweep + F13 360px audit fixes.
6. F11 DPR clamp + F14 visibility pause.

**Exit criteria (measurable):** CI green on push; `npx playwright test` 6/6; axe serious = 0 on 6 routes; Lighthouse mobile perf/a11y ≥ 90/95; zero horizontal scroll at 360px; ≥20 unit tests green.

### Phase 2 — Polish & delight (days 5–7)
1. F16 central motion variants + migrate primitives.
2. F20 Home choreography pass.
3. F17 View Transitions; F18 sound toggle; F19 haptics.
4. F2 fluid type tokens; F3 focus ring; F4 print stylesheet.
5. `docs/DESIGN-SYSTEM.md` + `docs/ACCESSIBILITY.md` (contrast matrix, audit table).
6. knip sweep; extract 3 canvas-lib modules (F10).

**Exit criteria:** micro-interaction inventory at 100% coverage; reduced-motion e2e parity passes; design-system doc + evidence tables committed.

### Phase 3 — Beyond MVP (stretch, post-submission-safe)
- PWA: offline shell + installable lab (`vite-plugin-pwa`) — "the lab works on a plane" is a demo moment.
- WebGPU or shader-based SignalCore (WebGL2 fallback) for the signature hero.
- MDX writing pipeline for `/writing` with syntax highlighting.
- Self-hosted subset fonts + `font-display: optional` for zero-CLS.
- Per-project OG images generated from the Transmission SVG series.

### Measuring success per criterion

| Criterion | Instrument | Pass bar |
|---|---|---|
| Aesthetics (35) | Design-system doc + screenshot matrix (6 breakpoints × light/dark × 2 accents) + OG card | Doc shipped; matrix diff-clean; og:image renders |
| Architecture (25) | CI status, coverage summary, knip report, strict TS | Green CI, ≥70% coverage on `lib/`+`hooks/`, strict on, 0 dead exports |
| Responsiveness (20) | Lighthouse mobile (CI artifact), axe target-size, 360px screenshot | perf ≥90, a11y ≥95, target-size violations 0, no h-scroll |
| Delight (20) | Reduced-motion e2e, inventory checklist, manual demo run | Parity test passes; inventory 100%; choreography ≤1 janky frame on mid-tier phone |

---

## 4. Deliverables

### 4.1 Repository structure (target state)
```
├── .github/workflows/ci.yml
├── docs/
│   ├── ARCHITECTURE.md        # mermaid diagram: providers → engine → components
│   ├── DESIGN-SYSTEM.md       # tokens, type scale, Transmission rules
│   ├── ACCESSIBILITY.md       # contrast matrix, audit tables, statements
│   ├── TESTING.md             # strategy: unit/component/e2e/visual
│   ├── VISUAL-ENHANCEMENT-PLAN.md   # (exists)
│   └── COMPETITION-SCORING-PLAN.md  # (this file)
├── e2e/                       # Playwright specs + axe
├── public/  (favicon.svg, og.png, robots.txt)
├── src/
│   ├── components/{ui,layout,three,transmission,lab,forms,hero,home,projects,ambient,premium,timeline}
│   ├── engine/MotionEngine.tsx
│   ├── hooks/  context/  data/  types/
│   ├── lib/                   # pure logic: motion.ts, smoothScroll.ts, physics/*, audio.ts
│   └── test/setup.ts
├── lighthouserc.json
├── playwright.config.ts
└── README.md  LICENSE  CHANGELOG.md
```

### 4.2 Documentation
- **README**: badges (CI status, Lighthouse scores), quickstart, scripts table, 3 GIFs (hero, lab, command palette), architecture mermaid, link to docs/. This is the judges' first file — make it the sales page.
- **`docs/ARCHITECTURE.md`**: the MotionEngine single-clock story, artwork assignment map, data-flow diagram.
- **`docs/TESTING.md`** + **`docs/ACCESSIBILITY.md`**: strategy + evidence tables (screenshots of CI runs included).

### 4.3 Build & verify commands
```bash
npm run dev        # local dev (localhost:5173)
npm run build      # tsc -b && vite build
npm run preview    # serve dist (localhost:4173)
npm run lint       # oxlint --deny-warnings
npm run test       # vitest (unit)
npm run e2e        # playwright (smoke + axe)
npm run ci         # lint + typecheck + test + build (single command for judges)
npx @lhci/cli autorun   # Lighthouse report
```

### 4.4 Deployment + demo plan
1. **Deploy to Vercel** (or Netlify). ⚠️ BrowserRouter needs an SPA fallback or deep links 404: add `vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` (Netlify: `public/_redirects` with `/* /index.html 200`).
2. **Recorded demo (60–90s)**, matching how judges score:
   - 0–10s hero reactor ignition + typed headline
   - 10–25s `/lab`: drag terrain, palette harmonizer, neural inspector
   - 25–40s command palette (`/`), accent theme switch, dark/light
   - 40–55s DevTools mobile view → reduced-motion toggle → animations gracefully slow (accessibility flex)
   - 55–75s CI dashboard + Lighthouse 95s + test counters on screen
3. **Judge one-pager** (`docs/DEMO.md`): deployed URL + QR, 4 rubric categories each with 2 evidence bullets and links (CI run, Lighthouse PDF, design doc).
4. Optional: `demo/` folder with the recording + GIFs for offline judging.

---

## TL;DR execution order
1. strict TS → aliases → font fix → og:image → CI script (1 day, all "free" points)
2. Tests + Playwright + axe + Lighthouse CI (evidence = points)
3. Motion centralization + Home choreography + sound/haptics/View Transitions (delight ceiling)
4. Docs + deploy + demo recording (packaging = perceived quality)
