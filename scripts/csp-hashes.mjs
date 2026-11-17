/**
 * Replace 'unsafe-inline' in script-src with the hashes of the inline scripts
 * the build actually emitted.
 *
 * Runs after `astro build`, against dist/. The four inline scripts (the
 * no-flash theme script and three small hoisted modules) are hashed from the
 * built HTML, so the allow-list can never drift from what ships: change a
 * script and the next build allows the new hash and drops the old one.
 *
 * public/_headers carries the placeholder token below. If this script never
 * ran, that token is not valid CSP and browsers ignore it, so inline scripts
 * are blocked rather than silently allowed — failing closed.
 *
 * Exit 1 if the placeholder is missing or no inline script was found, because
 * either means the header and the build have stopped agreeing.
 */

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PLACEHOLDER = "'inline-script-hashes'";

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const headersPath = join(dist, '_headers');

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

/** Inline <script> bodies, with HTML comments removed first so a comment that
 *  mentions "<script>" is not mistaken for one. */
function inlineScripts(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, '');
  const scripts = [];
  for (const match of withoutComments.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const [, attributes, body] = match;
    if (/\bsrc\s*=/i.test(attributes)) continue;
    // JSON-LD and other data blocks are not executed, so CSP ignores them.
    if (/\btype\s*=\s*["']?application\/(ld\+)?json/i.test(attributes)) continue;
    scripts.push(body);
  }
  return scripts;
}

const hashes = new Set();
for (const file of await htmlFiles(dist)) {
  for (const body of inlineScripts(await readFile(file, 'utf8'))) {
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const headers = await readFile(headersPath, 'utf8');

if (!headers.includes(PLACEHOLDER)) {
  console.error(`csp-hashes: ${PLACEHOLDER} not found in dist/_headers`);
  process.exit(1);
}
if (hashes.size === 0) {
  console.error('csp-hashes: no inline scripts found in dist/ — is the build empty?');
  process.exit(1);
}

const sorted = [...hashes].sort();
await writeFile(headersPath, headers.replaceAll(PLACEHOLDER, sorted.join(' ')));
console.log(`csp-hashes: ${sorted.length} inline script hash(es) written to dist/_headers`);
