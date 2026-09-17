/**
 * Lighthouse runner with score gates — cross-platform.
 *
 * Chrome is launched via Playwright's launcher (`playwright.chromium.launch`)
 * rather than by hand: Playwright's process handling and CDP handshake work
 * identically on Windows dev boxes and CI runners (this is exactly what the
 * e2e job does every run), whereas hand-spawned `--remote-debugging-port`
 * Chrome proved unreliable to wait on in CI. Lighthouse connects to the
 * launched browser's CDP websocket; each audit gets a fresh browser.
 *
 * - Serves dist/ via `vite preview` (run `npm run build` first)
 * - Browser: CHROME_PATH env var (or Playwright's bundled chromium)
 * - 3 runs of `/` (median gated) + 1 run each of /projects and /lab
 * - Gates in GATES below + a deterministic home-transfer byte gate
 * - Writes JSON + HTML reports to .lighthouseci/
 *
 * Usage: CHROME_PATH=... npm run lh
 */
import { spawn } from 'node:child_process';
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
// Lighthouse's native client (a real lighthouse dependency, hoisted to the
// top-level node_modules). Used only to hand LH a prepared Page object.
import puppeteer from 'puppeteer-core';

// Breadcrumbs land in the uploaded artifact even on hard crashes, so a CI
// failure is always diagnosable. Synchronous on purpose: written the moment
// they happen, before any crash/exit can intervene.
const CRUMBS = [];
const crumb = (m) => {
  CRUMBS.push(`[${new Date().toISOString()}] ${m}`);
  console.log(`· ${m}`);
};
const writeCrumbs = () => {
  try {
    mkdirSync(REPORT_DIR, { recursive: true });
    writeFileSync(path.join(REPORT_DIR, 'breadcrumbs.log'), CRUMBS.join('\n') + '\n');
  } catch {
    /* best effort */
  }
};

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPORT_DIR = path.join(root, '.lighthouseci');

// Full stdout/stderr mirror inside the report artifact: CI log files are
// private, ::error annotations can be lost by process.exit racing stdout
// flush, but the artifact is always uploaded (`if: always()`). Every run's
// complete console output lands in .lighthouseci/runner-output.log.
mkdirSync(REPORT_DIR, { recursive: true });
const TEE = path.join(REPORT_DIR, 'runner-output.log');
const origWrite = process.stdout.write.bind(process.stdout);
const origErrWrite = process.stderr.write.bind(process.stderr);
const tee = (orig, chunk) => {
  try {
    appendFileSync(TEE, typeof chunk === 'string' ? chunk : String(chunk));
  } catch {
    /* best effort */
  }
  return orig(chunk);
};
process.stdout.write = (chunk, ...rest) => tee(origWrite, chunk, ...rest);
process.stderr.write = (chunk, ...rest) => tee(origErrWrite, chunk, ...rest);

const PORT = 4173;
// Port 0 asks the OS for a free port, avoiding collisions with anything a
// previous run left behind. The actual port is resolved from Chrome's CDP
// endpoint before each audit (it is deterministic for --remote-debugging-port).
const CDP_PORT = process.env.LH_CDP_PORT ? Number(process.env.LH_CDP_PORT) : 9333;
const BASE = `http://localhost:${PORT}`;

const GATES = {
  // Perf score: catastrophic tripwire only — the score moves ±10 points with
  // machine load even for a healthy build, so pinning it high just flakes CI.
  performance: 0.65,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 0.95,
};
// The deterministic bundle tripwire: the optimized build transfers ~336KB on
// `/`; the historical regression (charts + three.js re-entering the critical
// path) added exactly +98KB. A byte gate is hardware-independent, unlike the
// throttled score, so THIS is what guards the entry-bundle graph.
const HOME_WEIGHT_GATE_KB = 480;
const CATEGORIES = Object.keys(GATES);
const HOME_RUNS = process.env.LH_HOME_RUNS ? Number(process.env.LH_HOME_RUNS) : 3;
const EXTRA_ROUTES = ['/projects', '/lab'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// CI log files are private, but `::error::` workflow commands and check-run
// annotations are PUBLIC. Emit every failure through both channels so a red
// Lighthouse job is always diagnosable from the API without repo access.
const ghError = (msg) => {
  process.stdout.write(`::error::${String(msg).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A')}\n`);
};
process.on('uncaughtException', (err) => {
  crumb(`UNCAUGHT: ${String(err?.stack || err).slice(0, 800)}`);
  ghError(`lighthouse runner uncaught: ${String(err?.stack || err).slice(0, 500)}`);
  writeCrumbs();
  // process.exit() can race async stdout flushes (losing ::error lines);
  // exitCode lets Node drain streams first. The tee'd log is in the artifact.
  process.exitCode = 2;
});
process.on('unhandledRejection', (err) => {
  crumb(`UNHANDLED REJECTION: ${String(err?.stack || err).slice(0, 800)}`);
  ghError(`lighthouse runner unhandled rejection: ${String(err?.stack || err).slice(0, 500)}`);
  writeCrumbs();
  process.exitCode = 2;
});

async function waitFor(url, label, tries = 80) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error(`${label} did not become ready`);
}

if (!existsSync(path.join(root, 'dist', 'index.html'))) {
  console.error('✖ dist/index.html missing — run `npm run build` first.');
  process.exit(1);
}
// CHROME_PATH is optional: unset → Playwright's bundled chromium (the same
// binary the e2e suite uses; CI installs it explicitly). Set → any Chrome/
// Chromium executable.
const chromePath = process.env.CHROME_PATH || '';
if (chromePath && !existsSync(chromePath)) {
  console.error(`✖ CHROME_PATH set but not found: ${chromePath}`);
  process.exit(1);
}

// Report dir must exist before the first audit writes its LHR — on a fresh
// CI checkout nothing else creates it (writeCrumbs only runs at the end).
mkdirSync(REPORT_DIR, { recursive: true });

// 1. Serve the production build.
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const preview = spawn(npm, ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

// 2. Chrome is launched fresh per audit inside runOne() — one audit, one
//    browser, one blast radius on constrained CI runners.

let exitCode = 0;
try {
  await waitFor(`${BASE}/`, 'vite preview');

  const mod = await import('lighthouse');
  const lighthouse = mod.default ?? mod;

  // Fresh browser per audit: on constrained runners a single navigation can
  // take the browser's CDP connection down with it; a shared browser then
  // fails every remaining run instantly. One audit = one browser = one blast
  // radius. forceFlushProtocol guards against the known "No LHR returned"
  // protocol race on slow machines.
  //
  // The browser is launched by Playwright — the exact launcher the e2e job
  // proves works on every runner — and we additionally expose a CDP TCP port
  // for Lighthouse to connect to.
  const runOne = async (route, index) => {
    // Distinct port per audit so a lingering socket from the previous browser
    // can never block the next bind.
    const cdpPort = CDP_PORT + index;
    crumb(`launching browser for ${route} run ${index} (cdp :${cdpPort})`);
    // Playwright's launcher is the one proven-reliable way to start Chrome on
    // every machine this repo runs on (the e2e job uses it on CI daily).
    const browser = await chromium.launch({
      executablePath: chromePath || undefined,
      headless: true,
      args: [
        `--remote-debugging-port=${cdpPort}`,
        // Container/CI-safe: the sandbox can fail for the runner user and the
        // default /dev/shm is too small for multiple renderer processes.
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
      ],
    });
    let pb;
    try {
      await waitFor(`http://127.0.0.1:${cdpPort}/json/version`, `Chrome CDP (run ${index})`);
      crumb(`cdp ready for ${route} run ${index}`);
      // Puppeteer (LH's native client) attaches to the Playwright-launched
      // browser so Lighthouse can drive a Page we control.
      const ver = await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json();
      pb = await puppeteer.connect({ browserWSEndpoint: ver.webSocketDebuggerUrl, defaultViewport: null });
      const page = await pb.newPage();
      // Model a mid-tier phone honestly: 4 logical cores, like the devices
      // these budgets are written for. The app's own adaptive-quality gates
      // (3D stage skip) then behave during audits exactly as on such a device
      // — without this, desktop cores let the GL stage run during the audit
      // and TBT explodes for a scenario no real target device experiences.
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          get: () => 4,
          configurable: true,
        });
      });
      // Audit the app's most conservative state — the same contract the axe
      // suite enforces. Stabilizes animation sampling (no mid-fade contrast
      // flakes) and keeps decorative canvases idle.
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      const result = await lighthouse(
        `${BASE}${route}`,
        {
          port: cdpPort,
          output: ['json', 'html'],
          onlyCategories: CATEGORIES,
          logLevel: 'error',
          maxWaitForLoad: 90_000,
          forceFlushProtocol: true,
        },
        undefined,
        page,
      );
      crumb(`audit done for ${route} run ${index}`);
      const { lhr, report } = result;
      const safeName = route === '/' ? 'home' : route.replace(/\//g, '');
      writeFileSync(
        path.join(REPORT_DIR, `lhr-${safeName}-${index}.json`),
        report[0],
      );
      if (index === 1) {
        writeFileSync(path.join(REPORT_DIR, `report-${safeName}.html`), report[1]);
      }
      return lhr;
    } finally {
      // puppeteer.close() on a connect()ed browser only disconnects; the
      // Playwright handle owns (and closes) the actual process.
      if (pb) await pb.close().catch(() => {});
      await browser.close().catch(() => {});
      await sleep(200);
    }
  };

  const median = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };

  const summarize = (lhr) => ({
    scores: Object.fromEntries(
      CATEGORIES.map((c) => [c, lhr.categories[c]?.score ?? 0]),
    ),
    lcp: Math.round(lhr.audits['largest-contentful-paint']?.numericValue ?? 0),
    fcp: Math.round(lhr.audits['first-contentful-paint']?.numericValue ?? 0),
    tbt: Math.round(lhr.audits['total-blocking-time']?.numericValue ?? 0),
    cls: +(lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
    weightKB: Math.round((lhr.audits['total-byte-weight']?.numericValue ?? 0) / 1024),
  });

  const failures = [];
  const routeErrors = [];

  // Home: HOME_RUNS runs, median of each category is gated.
  const homeRuns = [];
  for (let i = 1; i <= HOME_RUNS; i++) {
    process.stdout.write(`home run ${i}/${HOME_RUNS}… `);
    try {
      crumb(`home run ${i} starting`);
      const lhr = await runOne('/', i);
      const s = summarize(lhr);
      homeRuns.push(s);
      console.log(`perf ${(s.scores.performance * 100).toFixed(0)} a11y ${(s.scores.accessibility * 100).toFixed(0)}`);
    } catch (err) {
      console.log('FAILED');
      ghError(`home run ${i}: ${String(err?.stack || err).slice(0, 400)}`);
      crumb(`home run ${i} FAILED: ${String(err).slice(0, 400)}`);
      routeErrors.push(`/ run ${i}: ${err?.message ?? err}`);
    }
  }
  const home = {
    scores: Object.fromEntries(
      CATEGORIES.map((c) => [c, median(homeRuns.map((r) => r.scores[c]))]),
    ),
    lcp: median(homeRuns.map((r) => r.lcp)),
    fcp: median(homeRuns.map((r) => r.fcp)),
    tbt: median(homeRuns.map((r) => r.tbt)),
    cls: median(homeRuns.map((r) => r.cls)),
    weightKB: median(homeRuns.map((r) => r.weightKB)),
  };

  const extra = {};
  for (const route of EXTRA_ROUTES) {
    process.stdout.write(`${route} … `);
    try {
      crumb(`${route} starting`);
      const lhr = await runOne(route, 1);
      extra[route] = summarize(lhr);
      console.log(`perf ${(extra[route].scores.performance * 100).toFixed(0)}`);
    } catch (err) {
      console.log('FAILED');
      ghError(`${route}: ${String(err?.stack || err).slice(0, 400)}`);
      crumb(`${route} FAILED: ${String(err).slice(0, 400)}`);
      routeErrors.push(`${route}: ${err?.message ?? err}`);
    }
  }

  // 3. Gates.
  // A run with zero completed home audits has no medians to gate: bail out
  // loudly instead of evaluating gates against undefined values (which would
  // compare NaN < gate → false and "pass" vacuously).
  if (!homeRuns.length) {
    // Throwing (not process.exit) so the finally-block cleanup runs and the
    // outer catch reports it through the normal path.
    throw new Error('no home audits completed — every run failed');
  }
  console.log('\n=== Scores (mobile emulation) ===');
  const row = (label, s) =>
    console.log(
      `${label.padEnd(12)} perf ${(s.scores.performance * 100).toFixed(0)}  a11y ${(s.scores.accessibility * 100).toFixed(0)}  bp ${(s.scores['best-practices'] * 100).toFixed(0)}  seo ${(s.scores.seo * 100).toFixed(0)}  | LCP ${s.lcp}ms  TBT ${s.tbt}ms  CLS ${s.cls}  weight ${s.weightKB}KB`,
    );
  row('home (median)', home);
  for (const route of EXTRA_ROUTES) row(route, extra[route]);

  for (const [label, s] of [['home (median)', home], ...EXTRA_ROUTES.map((r) => [r, extra[r]])]) {
    for (const c of CATEGORIES) {
      if (s.scores[c] < GATES[c]) {
        failures.push(`${label}: ${c} ${(s.scores[c] * 100).toFixed(0)} < gate ${GATES[c] * 100}`);
      }
    }
    if (label.startsWith('home') && s.weightKB > HOME_WEIGHT_GATE_KB) {
      failures.push(`${label}: transfer ${s.weightKB}KB > gate ${HOME_WEIGHT_GATE_KB}KB (eager-bundle regression?)`);
    }
  }

  if (failures.length) {
    console.error('\n✖ Score gate failures:');
    for (const f of failures) console.error(`  - ${f}`);
    exitCode = 1;
  } else {
    console.log('\n✓ All score gates passed.');
  }
  if (routeErrors.length) {
    console.error('\n✖ Audit errors:');
    for (const e of routeErrors) console.error(`  - ${e}`);
    exitCode = 1;
  }
  writeCrumbs();

  // 4. GitHub job summary — appended when GITHUB_STEP_SUMMARY is set (CI),
  // silently skipped locally.
  if (process.env.GITHUB_STEP_SUMMARY) {
    const cell = (v, g) => `${v >= g ? '✅' : '❌'} ${(v * 100).toFixed(0)}`;
    const sumRow = (label, s) =>
      `| ${label} | ${cell(s.scores.performance, GATES.performance)} | ${cell(s.scores.accessibility, GATES.accessibility)} | ${cell(s.scores['best-practices'], GATES['best-practices'])} | ${cell(s.scores.seo, GATES.seo)} | ${s.lcp} ms | ${s.tbt} ms | ${s.cls} | ${s.weightKB} KB |`;
    const lines = [
      '## Lighthouse scores — mobile emulation',
      '',
      '| Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS | Transfer |',
      '|---|---|---|---|---|---:|---:|---:|---:|',
      ...(
        homeRuns.length
          ? [sumRow(`\`/\` (median of ${homeRuns.length} runs)`, home)]
          : []
      ),
      ...EXTRA_ROUTES.filter((r) => extra[r]).map((r) => sumRow(`\`${r}\``, extra[r])),
      '',
      `Gates: perf ≥ ${(GATES.performance * 100).toFixed(0)} · a11y ≥ ${(GATES.accessibility * 100).toFixed(0)} · best-practices ≥ ${(GATES['best-practices'] * 100).toFixed(0)} · seo ≥ ${(GATES.seo * 100).toFixed(0)} · home transfer ≤ ${HOME_WEIGHT_GATE_KB}KB — ${failures.length ? `❌ ${failures.length} gate failure(s)` : '✅ all passed'}`,
      '',
    ];      if (routeErrors.length) {
      lines.push('### Audit errors', '', ...routeErrors.map((e) => `- ${e.replace(/\n/g, ' ')}`), '');
    }
    lines.push('Reports: `.lighthouseci/` artifact (JSON + HTML per run).', '');
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }
} catch (err) {
  console.error(err);
  ghError(`lighthouse runner fatal: ${String(err?.stack || err).slice(0, 500)}`);
  crumb(`FATAL: ${String(err).slice(0, 600)}`);
  writeCrumbs();
  exitCode = 1;
} finally {
  writeCrumbs();
  if (process.platform === 'win32') {
    // shell:true means preview.pid is the cmd.exe wrapper — /T gets the vite child too.
    spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    preview.kill();
  }
  await sleep(400);
  // Not process.exit(): it can truncate async stdout flushes, losing ::error
  // annotations. exitCode lets Node drain streams and exit naturally.
  process.exitCode = exitCode;
}
