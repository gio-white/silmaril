/**
 * Move each locale's 404 page to where Cloudflare Pages looks for it.
 *
 * Astro writes src/pages/it/404.astro to dist/it/404/index.html, because only
 * the root 404 gets special treatment. Cloudflare Pages serves the nearest
 * `404.html` up the requested path, so the Italian page has to be
 * dist/it/404.html. Moving it (rather than copying) also stops /it/404/ from
 * existing as an ordinary 200 page.
 */

import { existsSync } from 'node:fs';
import { readdir, rename, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

let moved = 0;
for (const entry of await readdir(dist, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const nested = join(dist, entry.name, '404', 'index.html');
  if (!existsSync(nested)) continue;
  await rename(nested, join(dist, entry.name, '404.html'));
  await rm(join(dist, entry.name, '404'), { recursive: true });
  moved += 1;
}
console.log(`localized-404: ${moved} locale 404 page(s) moved`);
