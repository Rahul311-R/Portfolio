# RAHUL R — Personal Portfolio & Creative Coding Laboratory

[![CI](https://github.com/Rahul311-R/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Rahul311-R/Portfolio/actions/workflows/ci.yml) [![e2e](https://img.shields.io/badge/e2e-58%20Playwright%20specs-0A0B11?labelColor=1a1c26&color=C9A45C)](#7-testing-strategy) [![a11y](https://img.shields.io/badge/axe-zero%20serious%2Fcritical-0A0B11?labelColor=1a1c26&color=C9A45C)](#7-testing-strategy) [![Lighthouse](https://img.shields.io/badge/Lighthouse_mobile-Perf_80_·_A11y_100_·_BP_100_·_SEO_100-0A0B11?labelColor=1a1c26&color=C9A45C)](docs/PERFORMANCE.md)

**AI × DATA × CODE**

> *"Building useful things with code."*

A production-quality, dark-first personal portfolio and digital laboratory for **Rahul R**, a B.Tech Artificial Intelligence & Data Science graduate from Coimbatore, Tamil Nadu, India.

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### 1. Clone or Open Project Directory
Navigate to the project root directory in your terminal / command prompt:
```bash
cd "c:\Users\ELCOT\Documents\anti port"
```

### 2. Install Dependencies
Install all required packages (React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, React Hook Form, Zod):
```bash
npm install
```

### 3. Start Development Server
Launch the Vite local development server:
```bash
npm run dev
```
*(On Windows PowerShell systems with script execution policies, run via cmd: `cmd /c npm run dev`)*

The server will start at `http://localhost:5173`. Open this URL in your web browser to explore the portfolio.

### 4. Build for Production
To create a minified, production-ready bundle:
```bash
npm run build
```

### 5. Preview Production Build
To preview the production bundle locally:
```bash
npm run preview
```

### 6. One-command Verification & Assets
Run lint + typecheck + unit tests + build in one shot (what CI runs):
```bash
npm run ci
```
Run the end-to-end suite (58 Playwright specs: route smoke, axe accessibility gates, responsive checks at 360/390px).
Serves the production build automatically; run `npm run build` first if `dist/` is missing:
```bash
npm run e2e
```
Watch mode for unit tests:
```bash
npm run test:watch
```
Regenerate the Open Graph social card after editing `public/og-card.svg`:
```bash
npm run og
```
Run the mobile Lighthouse audit with score gates (perf ≥ 0.75, a11y/bp/seo ≥ 0.95; exit 1 on regression). Requires `npm run build` first and a Chrome binary via `CHROME_PATH`:
```bash
CHROME_PATH="…/chrome.exe" npm run lh
```
Reports (JSON + HTML) land in `.lighthouseci/`. Measured scores and the
before/after story of the bundle-graph optimization: **[docs/PERFORMANCE.md](docs/PERFORMANCE.md)**.

### 7. Testing Strategy
| Layer | Tool | Scope |
|---|---|---|
| Unit | Vitest + Testing Library | hooks (`useInView`), lib guards (`smoothScroll`), zod schemas, data invariants, `ContactForm`/`Marquee` components |
| E2E smoke | Playwright | every route renders (reduced-motion parity), zero console errors, form + command-menu + fullscreen-menu interactions |
| Accessibility | Playwright + axe-core | zero serious/critical violations on 11 routes + both overlay menus (contrast, names, labels, ARIA validity) |
| Responsive | Playwright | no horizontal scroll at 360/390px, 44px touch-target floor, Pixel 7 device profile |
| Lighthouse | custom runner (`scripts/lighthouse.mjs`) | mobile-emulated audits of `/` (3-run median), `/projects`, `/lab` with CI score gates; JSON + HTML reports in `.lighthouseci/` |

### 8. Deployment (GitHub Pages)

Every push to `main` runs the three CI jobs above and — only if all of them pass — publishes the site to **GitHub Pages** (see the `deploy` environment on any workflow run for the live URL).

The deploy build runs `npm run build:pages`, which compiles with the `/Portfolio/` base and copies `index.html` to `404.html` so deep links like `/projects/weather-prediction-gui` resolve client-side instead of 404ing.

One-time repo setting: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

Manual local equivalent of the deploy build:
```bash
npm run build:pages
```

---

## ⚡ Performance

Mobile Lighthouse (3-run median): **Perf 80 · A11y 100 · Best-Practices 100 · SEO 100** on all audited routes.

The first-paint path carries **no WebGL and no charting code**: three.js (~895KB) is fetched on idle after paint (skipped on save-data/2G, reduced motion, or no WebGL — CSS aurora fallback), and recharts (~347KB) loads only inside its Lab experiment. Before the bundle-graph fix, every route modulepreloaded 341KB of charting vendor code and Home raced its GL fetch against the preloader.

Full before/after table, chunk graph, and gate rationale: **[docs/PERFORMANCE.md](docs/PERFORMANCE.md)**.

---

## 🛠️ Tech Stack

- **Core Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + Custom CSS Variables
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Icons**: Lucide React + Custom Inline SVGs
- **Data Visualizations**: Recharts + HTML5 Canvas Vector Physics
- **Form Handling**: React Hook Form + Zod Schema Validation

---

## 🌐 Site Routes & Pages

| Route | Page Name | Description |
|---|---|---|
| `/` | **Home** | Interactive particle hero, selected projects, skills snapshot, experience highlights, and lab teaser. |
| `/about` | **About** | Professional profile, core skills grid, 4-pillar engineering approach, and academic degree overview. |
| `/projects` | **Projects** | Filterable project gallery with smooth animated category switches (All, AI, Computer Vision, Data, Web, Experiments). |
| `/projects/:slug` | **Project Detail** | 9-part structured case study layout with interactive demos, architecture diagrams, and tech chips. |
| `/experience` | **Experience** | Vertical interactive timeline detailing Accenture, Vault of Code, and TATA internship achievements. |
| `/resume` | **Web Resume** | Full digital CV with section quick-jumps and downloadable CV placeholder. |
| `/lab` | **The Lab** | Signature creative coding showcase with 5 interactive physics, typography, canvas, color, and telemetry experiments. |
| `/contact` | **Contact** | Validated contact form with accessibility features, ARIA error states, and direct contact channels. |

---

## 🧪 Signature Interactive Demos & Lab Experiments

1. **Gravitational Particle Simulator** (`/lab`): Canvas physics simulation with velocity vectors and cursor attraction.
2. **Kinetic Matrix Typography** (`/lab`): Deconstructs "RAHUL R" text into interactive particle waves.
3. **Gesture Drawing Board** (`/projects/virtual-drawing-board` & `/lab`): Touchless interactive canvas simulation with adjustable brush sizes, color palettes, and eraser.
4. **Algorithmic Palette Harmonizer** (`/lab`): Mathematical HSL color matrix harmony generator with contrast calculation and one-click copy.
5. **Neural Data Stream Graph** (`/lab`): Real-time streaming telemetry visualization with animated packet flows.
6. **Weather REST API Simulator** (`/projects/weather-prediction-gui`): Live-simulated weather API search with JSON payload parsing and status codes.
7. **Global Command Palette**: Press `/` anywhere on the site to launch the quick route & action menu.
8. **Accent Theme Selector**: Choose between Violet, Cyan, Lime, and Orange primary themes with localStorage persistence.

---

## 📄 Factual Compliance Disclaimer

All education details (B.Tech AI & Data Science 2022–2026, 8.3/10 CGPA), employment history (Accenture Data Analytics Intern, Vault of Code Web Development Intern, TATA Visualization Trainee), certifications, and project claims strictly mirror Rahul R's resume without fabricating employment, titles, patents, metrics, or client lists. Unsupplied links or assets use clear `[ADD LINK]` / `[ADD IMAGE]` placeholders.

---

## 📡 Visual System — "Transmission Series"

Every page carries its own generative SVG artwork from the Transmission series (16 pieces: signal grids, packet lanes, relay switchboards, oscilloscope surveys, protocol handshakes, paper trails), plus six in-page section plates via `ArtifactPlate`. The shared map lives in `src/data/artwork.ts` — add a page by adding one entry. Interactive 3D: `DragCube3D`, `ParticleSphere3D`, `Coverlay3D`, `WaveTunnel3D` (Lab experiment 08), `PacketOrbit3D` + `SignalHelix3D` (Home transmission hub) — all drag-to-spin, reduced-motion aware, and paused when offscreen. Supporting primitives: `SignalBus` (live canvas packet animation), `CarrierWave` (CSS sweep beams), `ArtifactPlate` (framed section imagery), `TerminalPending` (styled link-pending chip), and `.signal-rule` (dotted carrier heading rule). Full rationale, phases, and asset guidelines: **[docs/VISUAL-ENHANCEMENT-PLAN.md](docs/VISUAL-ENHANCEMENT-PLAN.md)**.
