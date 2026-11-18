/**
 * List content that exists in English but not yet in Italian.
 *
 * Untranslated entries still render (in English, with a short note), so this
 * is a to-do list rather than a gate: CI prints it as warnings and passes.
 * Certifications are left out on purpose: their names are official titles
 * and are never translated.
 */

import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT = 'en';
const OTHERS = ['it'];
const COLLECTIONS = ['roles', 'education', 'projects', 'skills', 'now'];

const content = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');

const missing = [];
for (const collection of COLLECTIONS) {
  const source = join(content, collection, DEFAULT);
  if (!existsSync(source)) continue;
  for (const file of await readdir(source)) {
    for (const locale of OTHERS) {
      if (!existsSync(join(content, collection, locale, file))) {
        missing.push(`src/content/${collection}/${locale}/${file}`);
      }
    }
  }
}

for (const path of missing) {
  console.log(`::warning file=${path.replace(/\/it\//, '/en/')}::Not translated yet: ${path}`);
}
console.log(
  missing.length === 0
    ? 'check-translations: every entry is translated'
    : `check-translations: ${missing.length} entr${missing.length === 1 ? 'y' : 'ies'} not translated yet`,
);
