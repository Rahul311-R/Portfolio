/**
 * Rasterizes public/og-card.svg → public/og.png (1200×630) for Open Graph /
 * Twitter cards. Social crawlers do not support SVG, so the PNG is the shipped
 * artifact; the SVG stays in the repo as the editable source.
 *
 * Usage: npm run og
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const svg = fileURLToPath(new URL('../public/og-card.svg', import.meta.url));
const png = fileURLToPath(new URL('../public/og.png', import.meta.url));

await sharp(svg, { density: 96 })
  .png({ compressionLevel: 9 })
  .toFile(png);

console.log('Wrote public/og.png (1200×630)');
