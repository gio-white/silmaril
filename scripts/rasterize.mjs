/**
 * Rasterise authored SVGs into the formats crawlers and LCP actually want.
 *
 * SVG stays the source: a hairline grid is drawn as vectors. Slack, LinkedIn
 * and WhatsApp ignore SVG for unfurls, and the performance budget assumes
 * AVIF posters, so this step exists.
 *
 * Run: node scripts/rasterize.mjs
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
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

const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 128 >>
stream
BT /F1 24 Tf 72 720 Td (Alessandro Bernardini) Tj 0 -36 Td /F1 14 Tf (Data Engineer) Tj 0 -28 Td (Placeholder CV — replace public/cv.pdf) Tj ET
endstream
endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000446 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
527
%%EOF
`;

await writeFile(join(publicDir, 'cv.pdf'), pdf, 'utf8');
console.log('public/cv.pdf  placeholder');
