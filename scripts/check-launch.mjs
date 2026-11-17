/**
 * Launch guard: list every placeholder that must not reach the live site.
 *
 * Scans src/, public/ and astro.config.mjs for the markers below. Sample
 * content is allowed while the site is being built, so CI runs this with
 * --warn (annotations, exit 0); the go-live checklist runs it plain, where any
 * hit is a failure.
 */

import { readdir, readFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const MARKERS = ['PLACEHOLDER', 'example.com'];
const TEXT = /\.(astro|ts|mjs|js|css|md|mdx|yaml|yml|json|svg|html|txt|toml)$|^_headers$/;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const warnOnly = process.argv.includes('--warn');

async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (TEXT.test(entry.name)) files.push(path);
  }
  return files;
}

const files = [
  ...(await walk(join(root, 'src'))),
  ...(await walk(join(root, 'public'))),
  join(root, 'astro.config.mjs'),
];

const hits = [];
for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    const marker = MARKERS.find((m) => line.includes(m));
    if (marker) hits.push({ file: relative(root, file), line: index + 1, marker });
  });
}

for (const hit of hits) {
  const message = `${hit.marker} left in ${hit.file}:${hit.line}`;
  console.log(warnOnly ? `::warning file=${hit.file},line=${hit.line}::${message}` : message);
}

if (hits.length === 0) {
  console.log('check-launch: no placeholders left');
} else if (!warnOnly) {
  console.error(`check-launch: ${hits.length} placeholder(s) must be replaced before launch`);
  process.exit(1);
}
