# Visual Enhancement Plan — "Transmission" System

Patch notes and forward plan for the imagery, 3D, transmission-motif, layout, and polish work in this
portfolio (React 19 + Vite + Tailwind v4). Everything marked **[shipped]** is already in the codebase
after this pass; the rest is the prioritized roadmap.

> **Update — pervasive motion release.** Motion is no longer per-page: a shared `MotionEngine`
> (one rAF clock + pointer/scroll environment for the entire site) drives a site-wide `AmbientField`
> background, a `ScrollProgress` HUD, the hero `SignalCore3D` reactor, and every canvas in the
> project. Pages that previously had only artwork now carry live 3D/signal graphics: /projects
> (orbit hub), /writing (helix), /reading + /experience + /resume (knowledge/career/skill buses),
> /now (live relay strip), /uses (data-path tunnel), /contact (channel orbit), /lab (tunnel as
> experiment 08), /about (warp divider + two plates).

---

## 1. Patch notes — what shipped

### 1.1 Imagery: the Transmission series (10 artworks, one per page)

Sixteen hand-authored generative SVGs (1.5–3 KB each, zero raster assets) replace the previous situation
where `hero-field.svg` was reused on 6+ pages. Every page now has a unique, thematically assigned piece:

| Page | Artwork (`src/assets/`) | Motif |
|---|---|---|
| Home (hero) | `hero-field.svg` | Computational landscape (retained as the anchor) |
| About | `signal-grid.svg` | Identity radar / signal sweep |
| Projects | `packet-stream.svg` | Packet lanes in flight (TX/RX) |
| Experience | `route-map.svg` | Career route with milestone stations |
| Resume | `logic-relay.svg` | Skill relays wired into a central bus |
| Lab | `input-survey.svg` | Oscilloscope survey of a live signal |
| Writing | `words-clarity.svg` | Voice waveform over typeset lines |
| Reading | `library-feed.svg` | Book spines on a conveyor feed |
| Uses | `wiring-flow.svg` | Patchbay wiring into a terminal block |
| Now | `fault-tolerant.svg` | Channel status board + heartbeat |
| 404 | `signal-reroute.svg` | Packet rerouting around a dead node |

Coherence rules every artwork follows (keep them for future additions):
- 1600×1000 viewBox, `#0A0B11` ground, faint `#8B5CF6` grid at 12–18% opacity.
- Palette locked to the design tokens: violet `#8B5CF6`, cyan `#22D3EE`, ink `#F5F7FA`,
  status green `#34D399`, warning amber `#FBBF24`, error `#FF007F`.
- Every frame carries a mono `SIG nn · LABEL` caption tying it to the series.
- Directional cues (arrows, TX→/←RX, sweeping paths) so every image "transmits".

**[shipped]** Central assignment map: `src/data/artwork.ts` — `PAGE_ARTWORK` (per page),
`SECTION_ARTWORK` (section plates) and `PROJECT_ARTWORK` (per project case study). One import site
instead of five duplicated maps (previously duplicated in `ProjectCard`, `ProjectDetail`, `Coverflow3D`).

**[shipped]** Home gained a "Transmission" band: a coherent 3-tile image grid (Capture → Process →
Display) using series artwork, plus a live `SignalBus`. The 404 page uses `signal-reroute.svg` with a
matching 3-lane bus underneath.

### 1.1b Section plates (in-page imagery)

Beyond mastheads, six more artworks serve as **section plates** inside page bodies via the reusable
`ArtifactPlate` component (framed artwork + `SIG nn` caption chip + carrier sweep + legibility
gradient, `loading="lazy"` by default):

| Section | Artwork | Motif |
|---|---|---|
| About / Operating principles | `signal-values.svg` | Four principle blocks on a shared bus |
| About / Daily rhythm | `daily-rhythm.svg` | Day timeline with deep-work blocks |
| Experience / closing | `internship-relay.svg` | Internships + certifications converging into a growth node |
| Reading / Papers | `paper-trail.svg` | Papers linked by citation flow |
| Contact / opening | `handshake.svg` | Two protocol stacks completing SYN/ACK |
| Home / Transmission band | `packet-stream` + `experience` + `contact` reuse | Capture → Process → Display tiles |

Every plate follows the same coherence rules as §1.1, so pages now carry imagery at **two scales**:
a full-bleed masthead and supporting in-page plates, never random clip-art.

### 1.2 Motion architecture (the engine)

**`src/engine/MotionEngine.tsx` [shipped]** — one `requestAnimationFrame` loop for the whole app,
provided via context. Every animated canvas subscribes to it, so six animated sections cost one loop,
not six. Each frame callback receives `{ t, dt, scrollY, scrollVel, pointerX/Y, pointerNX/NY,
pointerActive }` — scroll velocity and pointer position are computed once and shared. Under the
manual reduced-motion toggle the clock slows to a gentle ~8fps cadence instead of stopping, so
visuals breathe without racing.

**`AmbientField` [shipped]** — fixed full-viewport canvas behind all pages: parallax motes that
drift and glow near the pointer, two breathing carrier ribbons, packets that streak faster while you
scroll, and a soft cursor halo. Accent-aware (follows the violet/cyan/lime/orange selector).

**`ScrollProgress` [shipped]** — top-of-viewport gradient bar that fills with scroll depth and flares
with scroll velocity (engine-driven, zero scroll listeners).

**`SignalCore3D` [shipped]** — the hero centerpiece replacing the static hero artwork: three tilted
orbital rings of nodes around a pulsing reactor core, depth-sorted with core beams, leaning toward
the pointer in fake-3D parallax, detonating a shockwave on click. IO-gated; runs on the engine clock.

### 1.3 3D inventory

The site's 3D is intentionally dependency-free (CSS 3D + canvas projection): `DragCube3D`,
`ParticleSphere3D`, `Coverflow3D`, `ScrubHero`, `WarpDivider`. **[shipped] additions:**

- **`SignalBus`** (`src/components/transmission/SignalBus.tsx`) — canvas animation of packet traffic
  over labelled lanes with a heartbeat waveform. Single `requestAnimationFrame` loop, delta-time based,
  `IntersectionObserver` pauses it fully when offscreen, static frame under `prefers-reduced-motion`,
  `aria-hidden` (decorative).
- **`CarrierWave`** — pure-CSS sweeping beams overlaid on masthead artwork (`PageMasthead`) and the
  Home transmission panel. Transform/opacity-only animation (GPU-composited), collapses to a static
  wave under reduced motion.
- **`WaveTunnel3D`** (`/lab` experiment 08) — perspective tunnel of signal rings streaming toward a
  vanishing point; drag to steer the tunnel. Classic fake-3D projection on canvas.
- **`PacketOrbit3D`** (Home / Transmission hub) — three tilted orbital rings of packets circling a
  glowing hub at different speeds and directions; drag to spin the whole orbit with momentum.
- **`SignalHelix3D`** (Home / Transmission hub) — rotating double helix of paired signal nodes with
  rungs, depth-sorted rendering; drag to spin.
- **`TerminalPending`** — styled dashed chip with blinking caret replacing every raw `[ADD LINK]`
  string (Contact, Footer, ProjectDetail, Resume, Reading). Reading.tsx no longer renders broken
  `<a href="[ADD LINK]">` anchors — pending links render the chip instead.

### 1.3 Layout, cleanup, polish

- **[shipped]** Removed dead files: `src/App.css` (orphaned Vite-template CSS), `src/assets/hero.png`,
  `react.svg`, `vite.svg`, `public/icons.svg` (all unreferenced). README no longer ends with corrupted
  NUL bytes.
- **[shipped]** Masthead artwork prop is now optional and centrally resolved; new pages get a correct
  artwork by default.
- **[unchanged by design]** Existing alignment system (12-col grids, `max-w-7xl`, section rhythm
  `space-y-16/24`) was already coherent; new sections reuse it.

---

## 2. Technologies & tools

### Current stack (kept)

| Concern | Tool | Why |
|---|---|---|
| Framework | React 19 + TypeScript + Vite 8 | Already in place; route-level code-splitting works well |
| Styling | Tailwind CSS v4 + CSS custom properties | Token-driven theming (`index.css`) with dark/light swap |
| Motion | Framer Motion + hand-rolled rAF canvas | Small animated surface area without a 3D runtime |
| 3D | CSS `perspective`/`preserve-3d` + 2D-canvas projection | Zero-dependency, ~60fps, reduced-motion friendly |
| Imagery | Hand-authored SVG imported as modules | Vite inlines ≤4KB / fingerprints the rest; crisp at any DPR |

### Optional upgrade path (Phase 3)

If true mesh 3D is ever needed (e.g. an interactive rig on `/lab`):

```bash
npm i three @react-three/fiber @react-three/drei
```

Rules if adopted:
1. Load R3F canvases via `React.lazy` + `LazyMount` (pattern already used in `/lab`).
2. One canvas per page maximum; never in the navbar/footer.
3. Cap `dpr={[1, 1.75]}`, `frameloop="demand"` where possible, and respect `useReducedMotion()`
   by rendering a single static frame.
4. Ship DRACO-compressed GLB only; keep it under 300 KB; show a poster image while loading.
5. Tree-shake: import from `three/examples/jsm/...` selectively; verify chunk impact with
   `npx vite-bundle-visualizer`.

Do **not** adopt three.js just to redraw what the canvas components already do well — the current
implementation ships ~0 KB extra runtime for its 3D.

---

## 3. Phased plan

### Phase 1 — MVP (shipped in this pass)
- [x] Unique per-page Transmission-series artwork + central map
- [x] Live SignalBus + CarrierWave motif primitives
- [x] Home transmission band (image grid + live bus), themed 404
- [x] `[ADD LINK]` placeholders styled as TerminalPending chips (no broken anchors)
- [x] Dead-asset cleanup, README corruption fix
- [x] Verification: `tsc -b`, `vite build`, `oxlint` green

### Phase 2 — Next increment (1–2 sessions)
- [ ] Fill the real values behind pending chips (email, GitHub, LinkedIn, CV PDF, paper/resource links)
- [ ] OG/Twitter share images generated from the series (1200×630 PNG exports)
- [ ] `loading="lazy"` + `decoding="async"` audit on below-the-fold imagery (grid tiles done; mastheads load eagerly by design)
- [ ] Micro-typography pass: optical size on display headings, `text-wrap: balance` on section intros
- [ ] Add `Vary: prefers-color-scheme`-safe favicon variants; check light-theme contrast of artworks (they render on `--visual-bg`, mostly fine)
- [ ] Visual regression snapshotting (Playwright) for the 12 routes

### Phase 3 — Ambitious bets
- [ ] One R3F "transmission rig" on `/lab` (packets flowing through a tube geometry) following the rules in §2
- [ ] Sound-reactive SignalBus (user-initiated, off by default)
- [ ] Animated SVG artwork (SMIL-free: CSS `@keyframes` inside scoped SVG or JS-driven `stroke-dashoffset`)
- [ ] Series poster generator script (Node + `sharp`) to render artworks to optimized AVIF for social cards

---

## 4. Asset guidelines

**Format ladder**
1. Generative line-art → **inline SVG module** (current approach). Budget: ≤3 KB per file.
2. Photographic/complex → **AVIF** with **WebP** fallback (`<picture>`), JPEG last resort.
3. Never ship PNG for photos; PNG only for screenshots requiring pixel fidelity.

**Sizes** (mastheads render in a 5/4 frame, ~640px wide at 2× DPR)
- Masthead art: 1280×1024 raster equivalent (SVG: viewBox 1600×1000)
- Grid tiles: 800×600 raster equivalent
- Social cards: 1200×630 PNG/AVIF

**Naming**: kebab-case, motif-named (`packet-stream.svg`), never `final2.svg`. All assets live in
`src/assets/` and are imported (hashed by Vite) — nothing referenced by absolute URL.

**Optimization commands** (when raster assets arrive):
```bash
npx @squoosh/cli --avif '{quality:60}' --webp '{quality:75}' src/assets/*.png
npx svgo src/assets/*.svg   # only if a hand-authored file bloats; check output visually
```

**Performance budget** (current build): artwork chunk ≈ 9 KB gzip total for all 10 SVGs + SignalBus;
lazy chunks per route ≤ 9 KB gzip; vendors are the only large chunks and are shared. Keep total
image payload per route under ~120 KB.

---

## 5. Accessibility & responsive notes

- **Decorative motion is never announced**: `SignalBus`/`CarrierWave` render inside `aria-hidden`
  containers; artwork `<img>`s use `alt=""` (they illustrate, not inform).
- **Reduced motion contract** (must hold for every future component):
  1. Canvas loops render one static frame and never start rAF (`useReducedMotion` gate).
  2. CSS animations collapse to a static state (see `.carrier-wave` reduced-motion block).
  3. Global kill-switch in `index.css` zeroes all durations under `prefers-reduced-motion: reduce`.
- **Interactive 3D** (`DragCube3D`, `Coverflow3D`) exposes `role="img"`/carousel semantics, arrow-key
  operation, visible `focus-visible` rings, and `role="status"` announcements.
- **Pending links**: `TerminalPending` chips are non-interactive `<span>`s with a `title` tooltip —
  they don't fake affordance the way a dead `<a href="[ADD LINK]">` did.
- **Contrast**: body text meets 4.5:1 on both themes; artwork text (`fill-opacity .4` mono captions)
  is decorative and exempt, but keep ≥ .35 opacity for legibility on the dark ground.
- **Responsive**: mastheads stack at `lg`; the Home transmission band stacks at `lg` (grid tiles go
  1→3 at `sm`); SignalBus heights are fixed px (140–230) so the canvas never reflows text; all type
  scales via `clamp()` on heroes.

---

## 6. Integration snippets

**Add artwork for a new page** — one file + one map entry, done:

```ts
// src/assets/packet-relay.svg  (copy the coherence rules from §1.1)
// src/data/artwork.ts
import packetRelay from '../assets/packet-relay.svg';

export const PAGE_ARTWORK = {
  // ...
  playground: packetRelay,   // then: <PageMasthead artwork={PAGE_ARTWORK.playground} ... />
} as const;
```

Note: `<PageMasthead>` now resolves `artwork` optionally — pass nothing and it falls back to the
hero anchor. Explicit is still preferred.

**Live bus in any panel:**

```tsx
import { SignalBus } from '../components/transmission/SignalBus';

<SignalBus height={190} lanes={4} />  {/* aria-hidden, self-pausing when offscreen */}
```

**Carrier beams over a framed image:**

```tsx
import { CarrierWave } from '../components/transmission/CarrierWave';

<div className="artifact-frame visual-stage relative aspect-[5/4] overflow-hidden rounded-2xl">
  <img src={art} alt="" className="h-full w-full object-cover" />
  <CarrierWave />
</div>
```

**Section heading in the motif:**

```tsx
<div className="signal-rule">Live relays</div>  {/* dotted carrier rule, mono label */}
```

**Pending link:**

```tsx
import { TerminalPending } from '../components/ui/TerminalPending';
<TerminalPending label="Paper link" />
```

**R3F sketch (Phase 3 only)** — the shape a `/lab` rig would take:

```tsx
const Rig = lazy(() => import('./Rig')); // <Canvas dpr={[1,1.75]} frameloop="demand"> inside
<LazyMount minHeight={520} fallbackLabel="Loading rig…">
  <Suspense fallback={<ExperimentFallback label="Loading rig…" />}><Rig /></Suspense>
</LazyMount>
```
