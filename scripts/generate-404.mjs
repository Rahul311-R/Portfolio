/**
 * GitHub Pages SPA fallback: Pages 404s on deep links like /projects/foo
 * because only /index.html exists. Copying index.html to 404.html makes
 * Pages serve the app shell for any unknown path; React Router then takes
 * over client-side. Idempotent; run after the production build.
 *
 * Usage: node scripts/generate-404.mjs  (wired into `npm run build:pages`)
 */
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'));
console.log('dist/404.html written (SPA fallback for GitHub Pages)');
