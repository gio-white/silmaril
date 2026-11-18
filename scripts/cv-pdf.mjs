/**
 * Print the /cv page to public/cv.pdf, so the downloadable CV is the site's
 * own content rather than a hand-made file that drifts.
 *
 * Needs a built site (`pnpm build`) and a local Chrome or Chromium: set
 * CHROME_PATH, or the script tries the usual install locations. It serves
 * dist/ on a throwaway local port, prints the page with the print stylesheet
 * in /cv, and writes the PDF. Run it after any content change and commit the
 * PDF with that change.
 *
 * Not part of `pnpm build`: Cloudflare Pages has no browser to print with.
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/** Route on the built site → PDF written into public/. */
const OUTPUTS = [
  { route: '/cv/', file: 'cv.pdf' },
  { route: '/it/cv/', file: 'cv-it.pdf' },
];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
};

const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].filter(Boolean);

const executablePath = CANDIDATES.find((path) => existsSync(path));
if (!executablePath) {
  console.error('cv-pdf: no Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.');
  process.exit(1);
}
if (!existsSync(join(dist, 'cv', 'index.html'))) {
  console.error('cv-pdf: dist/cv/index.html not found. Run `pnpm build` first.');
  process.exit(1);
}

const server = createServer(async (request, response) => {
  const path = normalize(decodeURIComponent(new URL(request.url, 'http://x').pathname));
  let file = join(dist, path);
  if (!file.startsWith(dist)) {
    response.writeHead(403).end();
    return;
  }
  if (path.endsWith('/')) file = join(file, 'index.html');
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const browser = await chromium.launch({ executablePath });
try {
  const page = await browser.newPage();
  for (const { route, file } of OUTPUTS) {
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: join(root, 'public', file),
      format: 'A4',
      // Paper is white: the site's tinted background is not printed.
      printBackground: false,
      preferCSSPageSize: true,
      tagged: true,
    });
    console.log(`cv-pdf: ${route} → public/${file}`);
  }
} finally {
  await browser.close();
  server.close();
}
