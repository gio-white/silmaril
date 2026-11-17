/**
 * Rasterise authored SVGs into the formats crawlers and LCP actually want.
 *
 * SVG stays the source: a hairline grid is drawn as vectors. Slack, LinkedIn
 * and WhatsApp ignore SVG for unfurls, and the performance budget assumes
 * AVIF posters, so this step exists.
 *
 * Run: node scripts/rasterize.mjs
 */
import { readFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function raster(input, outputs) {
  const svg = await readFile(input);
  for (const { path, format, width, height, quality } of outputs) {
    let pipeline = sharp(svg, { density: 144 }).resize(width, height, {
      fit: 'fill',
    });
    if (format === 'avif') pipeline = pipeline.avif({ quality, effort: 6 });
    else if (format === 'webp') pipeline = pipeline.webp({ quality });
    else if (format === 'png') pipeline = pipeline.png({ compressionLevel: 9 });
    else throw new Error(`Unsupported format: ${format}`);
    await pipeline.toFile(path);
    const info = await stat(path);
    console.log(`${path.replace(`${root}/`, '')}  ${(info.size / 1024).toFixed(1)}k`);
  }
}

const posters = join(root, 'src/assets/posters');
const publicDir = join(root, 'public');

await raster(join(posters, 'signal-surface-light.svg'), [
  {
    path: join(posters, 'signal-surface-light.avif'),
    format: 'avif',
    width: 1600,
    height: 900,
    quality: 40,
  },
  {
    path: join(posters, 'signal-surface-light.webp'),
    format: 'webp',
    width: 1600,
    height: 900,
    quality: 52,
  },
]);

await raster(join(posters, 'signal-surface-dark.svg'), [
  {
    path: join(posters, 'signal-surface-dark.avif'),
    format: 'avif',
    width: 1600,
    height: 900,
    quality: 40,
  },
  {
    path: join(posters, 'signal-surface-dark.webp'),
    format: 'webp',
    width: 1600,
    height: 900,
    quality: 52,
  },
]);

await raster(join(publicDir, 'og.svg'), [
  {
    path: join(publicDir, 'og.png'),
    format: 'png',
    width: 1200,
    height: 630,
    quality: 90,
  },
]);

// Project covers authored as SVG. Astro does not process SVG sources, so the
// PNG is what content files reference; astro:assets turns it into AVIF.
await raster(join(root, 'src/assets/projects/lakehouse-cost-lens.svg'), [
  {
    path: join(root, 'src/assets/projects/lakehouse-cost-lens.png'),
    format: 'png',
    width: 1600,
    height: 900,
  },
]);

// The 32px PNG fallback for browsers that ignore SVG favicons. Saved as .ico
// because that is the path browsers request on their own; every current
// browser accepts PNG data under that name.
await raster(join(publicDir, 'favicon.svg'), [
  {
    path: join(publicDir, 'favicon.ico'),
    format: 'png',
    width: 32,
    height: 32,
  },
]);
