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

// Breadcrumbs land in the uploaded artifact even on hard crashes, so a CI
// failure is always diagnosable (CI logs are private; artifacts are too, but
// the local run sees them and the summary is public).
const CRUMBS = [];
const crumb = (m) => {
  CRUMBS.push(`[${new Date().toISOString()}] ${m}`);
  console.log(`· ${m}`);
};
const writeCrumbs = async () => {
  try {
    await writeFile(path.join(REPORT_DIR, 'breadcrumbs.log'), CRUMBS.join('\n') + '\n');
  } catch {
    /* best effort */
  }
};
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REPORT_DIR = path.join(root, '.lighthouseci');
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

// 2. Chrome is launched fresh per audit inside runOne() (see below) — one
//    audit, one browser, one blast radius on constrained CI runners.
const userDataDir = path.join(os.tmpdir(), `lhci-profile-${Date.now()}`);

let exitCode = 0;
try {
  await waitFor(`${BASE}/`, 'vite preview');

  const mod = await import('lighthouse');
  const lighthouse = mod.default ?? mod;

  // Fresh Chrome per audit: on constrained runners a single navigation can
  // take the browser's CDP connection down with it; a shared browser then
  // fails every remaining run instantly. One audit = one browser = one blast
  // radius. forceFlushProtocol guards against the known "No LHR returned"
  // protocol race on slow machines.
  let chromeSeq = 0;
  const launchChrome = () => {
    const seq = ++chromeSeq;
    const dir = `${userDataDir}-${seq}`;
    const proc = spawn(
      chromePath,
      [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        '--remote-allow-origins=*',
        `--user-data-dir=${dir}`,
        '--no-first-run',
        '--no-default-browser-check',
        // Container/CI-safe: the sandbox can fail for the runner user and the
        // default /dev/shm is too small for multiple renderer processes.
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        'about:blank',
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
    // Chrome's startup failures (sandbox, crashpad, bad flags) only surface on
    // stderr — capture it so a failed launch is diagnosable from the artifact.
    let stderr = '';
    proc.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
      if (stderr.length > 4000) stderr = stderr.slice(-4000);
    });
    proc.on('exit', (code, signal) => {
      if (code !== 0 && code !== null) crumb(`chrome exited code=${code}: ${stderr.trim().slice(0, 600)}`);
      else if (code === null && signal) crumb(`chrome killed by ${signal}: ${stderr.trim().slice(0, 300)}`);
    });
    return { proc, dir };
  };

  const runOne = async (route, index) => {
    const { proc, dir } = launchChrome();
    try {
      await waitFor(`http://127.0.0.1:${CDP_PORT}/json/version`, `Chrome CDP (run ${index})`);
      crumb(`cdp ready for ${route} run ${index}`);
      const result = await lighthouse(
        `${BASE}${route}`,
        {
          port: CDP_PORT,
          output: ['json', 'html'],
          onlyCategories: CATEGORIES,
          logLevel: 'error',
          maxWaitForLoad: 90_000,
          forceFlushProtocol: true,
        },
        undefined,
      );
      crumb(`audit done for ${route} run ${index}`);
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
    } finally {
      proc.kill();
      await sleep(300);
      await import('node:fs/promises')
        .then((fs) => fs.rm(dir, { recursive: true, force: true }))
        .catch(() => {});
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
      crumb(`${route} FAILED: ${String(err).slice(0, 400)}`);
      routeErrors.push(`${route}: ${err?.message ?? err}`);
    }
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
  await writeCrumbs();

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
    await appendFile(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
  }
} catch (err) {
  console.error(err);
  crumb(`FATAL: ${String(err).slice(0, 600)}`);
  await writeCrumbs();
  exitCode = 1;
} finally {
  await writeCrumbs();
  if (process.platform === 'win32') {
    // shell:true means preview.pid is the cmd.exe wrapper — /T gets the vite child too.
    spawn('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    preview.kill();
  }
  await sleep(400);
  await import('node:fs/promises')
    .then((fs) => fs.rm(userDataDir, { recursive: true, force: true }))
    .catch(() => {});
  process.exit(exitCode);
}
