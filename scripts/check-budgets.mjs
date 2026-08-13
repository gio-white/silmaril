/**
 * Enforce the performance budget in .cursor/rules/design-system.mdc.
 *
 * Reads dist/ after `pnpm build`. Gzipped sizes for HTML, CSS, JS; raw file
 * size for WOFF2 (already compressed) and posters (already compressed).
 *
 * Exit 1 if any page or asset class is over budget, so a regression cannot
 * ship as a green build.
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const BUDGET = {
  html: 18 * 1024,
  css: 12 * 1024,
  criticalJs: 6 * 1024,
  fonts: 85 * 1024,
  poster: 35 * 1024,
  three: 140 * 1024,
};

const failures = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function gzipSize(buf) {
  return gzipSync(buf).length;
}

function kb(n) {
  return `${(n / 1024).toFixed(1)} kB`;
}

function check(label, actual, budget) {
  const ok = actual <= budget;
  const mark = ok ? 'ok' : 'OVER';
  console.log(`  ${mark.padEnd(4)} ${label.padEnd(48)} ${kb(actual).padStart(8)} / ${kb(budget)}`);
  if (!ok) failures.push(`${label}: ${kb(actual)} > ${kb(budget)}`);
}

let files;
try {
  files = await walk(dist);
} catch {
  console.error('dist/ is missing. Run `pnpm build` first.');
  process.exit(1);
}

const htmlFiles = files.filter((f) => extname(f) === '.html');
const cssFiles = files.filter((f) => extname(f) === '.css');
const jsFiles = files.filter((f) => extname(f) === '.js');
const fontFiles = files.filter((f) => extname(f) === '.woff2');
const posterFiles = files.filter((f) =>
  /signal-surface-(light|dark)\.[^/]+\.(avif|webp|svg)$/.test(f),
);

console.log('HTML (gzip, per page)');
for (const file of htmlFiles.sort()) {
  const buf = await readFile(file);
  check(relative(dist, file), gzipSize(buf), BUDGET.html);
}

console.log('CSS (gzip, all stylesheets combined)');
{
  let total = 0;
  for (const file of cssFiles) total += gzipSize(await readFile(file));
  // Inlined CSS lives in the HTML and is already counted there. This line
  // only catches a regression that starts emitting a large shared sheet.
  check('all .css files', total, BUDGET.css);
}

console.log('Critical-path JS (gzip, excluding the lazy three.js chunk)');
{
  let critical = 0;
  for (const file of jsFiles) {
    const buf = await readFile(file);
    const gz = gzipSize(buf);
    const name = relative(dist, file);
    // The scene module is the only chunk that is allowed to be large, and it
    // is fetched only after the capability gates pass. Everything else is
    // critical-path. Matching on filename `scene.*` rather than a size
    // heuristic so a future regression that bloats the loader still fails.
    if (/(^|\/)scene\.[^/]+\.js$/.test(name)) {
      check(`lazy ${name}`, gz, BUDGET.three);
    } else {
      critical += gz;
    }
  }
  check('critical-path JS', critical, BUDGET.criticalJs);
}

console.log('Fonts (raw WOFF2, latin; latin-ext is unicode-range gated)');
{
  let total = 0;
  for (const file of fontFiles) {
    const { size } = await stat(file);
    const name = relative(dist, file);
    console.log(`       ${name.padEnd(48)} ${kb(size).padStart(8)}`);
    // latin-ext is declared behind its own unicode-range, so most visitors
    // never fetch it. The 85 kB budget is the latin critical path.
    if (!name.includes('latin-ext')) total += size;
  }
  check('latin fonts', total, BUDGET.fonts);
}

console.log('Hero posters (raw, per theme, AVIF preferred)');
{
  const byTheme = new Map();
  for (const file of posterFiles) {
    const theme = file.includes('dark') ? 'dark' : 'light';
    const { size } = await stat(file);
    const current = byTheme.get(theme) ?? [];
    current.push({ file, size });
    byTheme.set(theme, current);
  }
  for (const [theme, variants] of byTheme) {
    const avif = variants.find((v) => v.file.endsWith('.avif')) ?? variants[0];
    check(`${theme} poster`, avif.size, BUDGET.poster);
  }
  if (byTheme.size === 0) {
    failures.push('No hero posters found in dist/');
    console.log('  OVER no posters found');
  }
}

if (failures.length > 0) {
  console.error(`\nBudget failed (${failures.length}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\nAll budgets within limits.');
