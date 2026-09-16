/**
 * Lighthouse runner with score gates — cross-platform.
 *
 * Why not `lhci autorun`: chrome-launcher's temp-profile cleanup raises
 * EPERM on some Windows setups. This runner launches Chrome itself (a
 * dedicated user-data-dir it owns), drives the `lighthouse` programmatic
 * API directly, and enforces the same score gates in code.
 *
 * - Serves dist/ via `vite preview` (run `npm run build` first)
 * - Chrome: CHROME_PATH env var (required)
 * - 3 runs of `/` (median gated) + 1 run each of /projects and /lab
 * - Gates: perf ≥ 0.75 (tripwire), a11y ≥ 0.95, best-practices ≥ 0.95, seo ≥ 0.95
 * - Writes JSON + HTML reports to .lighthouseci/
 *
 * Usage: CHROME_PATH=... npm run lh
 */
import { spawn } from 'node:child_process';
import { appendFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPORT_DIR = path.join(root, '.lighthouseci');
const PORT = 4173;
const CDP_PORT = 9333;
const BASE = `http://localhost:${PORT}`;

const GATES = {
  // Perf: regression tripwire, not an aspiration — measured mobile median is ~0.80
  // (the preloader's 1.65s curtain is a deliberate design moment and dominates LCP).
  // A broken bundle (eager three.js/charts back in the entry) drops 15-20 points.
  performance: 0.75,
  accessibility: 0.95,
  'best-practices': 0.95,
  seo: 0.95,
};
const CATEGORIES = Object.keys(GATES);
const HOME_RUNS = process.env.LH_HOME_RUNS ? Number(process.env.LH_HOME_RUNS) : 3;
const EXTRA_ROUTES = ['/projects', '/lab'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
const chromePath = process.env.CHROME_PATH;
if (!chromePath || !existsSync(chromePath)) {
  console.error('✖ Set CHROME_PATH to a Chrome/Chromium executable.');
  process.exit(1);
}

await mkdir(REPORT_DIR, { recursive: true });

// 1. Serve the production build.
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const preview = spawn(npm, ['run', 'preview', '--', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

// 2. Launch headless Chrome with our own profile dir (no temp-dir lifecycle).
const userDataDir = path.join(os.tmpdir(), `lhci-profile-${Date.now()}`);
const chrome = spawn(
  chromePath,
  [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank',
  ],
  { stdio: 'ignore' },
);

let exitCode = 0;
try {
  await waitFor(`${BASE}/`, 'vite preview');
  await waitFor(`http://127.0.0.1:${CDP_PORT}/json/version`, 'Chrome CDP');

  const mod = await import('lighthouse');
  const lighthouse = mod.default ?? mod;

  const runOne = async (route, index) => {
    const result = await lighthouse(
      `${BASE}${route}`,
      {
        port: CDP_PORT,
        output: ['json', 'html'],
        onlyCategories: CATEGORIES,
        logLevel: 'error',
      },
      undefined,
    );
    const { lhr, report } = result;
    const safeName = route === '/' ? 'home' : route.replace(/\//g, '');
    await writeFile(
      path.join(REPORT_DIR, `lhr-${safeName}-${index}.json`),
      report[0],
    );
    if (index === 1) {
      await writeFile(path.join(REPORT_DIR, `report-${safeName}.html`), report[1]);
    }
    return lhr;
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

  // Home: HOME_RUNS runs, median of each category is gated.
  const homeRuns = [];
  for (let i = 1; i <= HOME_RUNS; i++) {
    process.stdout.write(`home run ${i}/${HOME_RUNS}… `);
    const lhr = await runOne('/', i);
    const s = summarize(lhr);
    homeRuns.push(s);
    console.log(`perf ${(s.scores.performance * 100).toFixed(0)} a11y ${(s.scores.accessibility * 100).toFixed(0)}`);
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
    const lhr = await runOne(route, 1);
    extra[route] = summarize(lhr);
    console.log(`perf ${(extra[route].scores.performance * 100).toFixed(0)}`);
  }

  // 3. Gates.
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
  }

  if (failures.length) {
    console.error('\n✖ Score gate failures:');
    for (const f of failures) console.error(`  - ${f}`);
    exitCode = 1;
  } else {
    console.log('\n✓ All score gates passed.');
  }

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
      sumRow(`\`/\` (median of ${HOME_RUNS} runs)`, home),
      ...EXTRA_ROUTES.map((r) => sumRow(`\`${r}\``, extra[r])),
      '',
      `Gates: perf ≥ ${(GATES.performance * 100).toFixed(0)} · a11y ≥ ${(GATES.accessibility * 100).toFixed(0)} · best-practices ≥ ${(GATES['best-practices'] * 100).toFixed(0)} · seo ≥ ${(GATES.seo * 100).toFixed(0)} — ${failures.length ? `❌ ${failures.length} gate failure(s)` : '✅ all passed'}`,
      '',
      'Reports: `.lighthouseci/` artifact (JSON + HTML per run).',
      '',
    ];
    await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }
} catch (err) {
  console.error(err);
  exitCode = 1;
} finally {
  if (process.platform === 'win32') {
    // shell:true means preview.pid is the cmd.exe wrapper — /T gets the vite child too.
    spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    preview.kill();
  }
  chrome.kill();
  await sleep(400);
  await import('node:fs/promises')
    .then((fs) => fs.rm(userDataDir, { recursive: true, force: true }))
    .catch(() => {});
  process.exit(exitCode);
}
