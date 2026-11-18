import { type CollectionEntry, type CollectionKey, getCollection } from 'astro:content';
import { defaultLocale, type Locale, localeTags, toLocale, useTranslations } from '../i18n';

/**
 * Content queries and date formatting.
 *
 * Every collection is split by locale folder: `src/content/roles/en/…` and
 * `src/content/roles/it/…`, matched by file name. A query for Italian returns
 * the Italian entry where one exists and falls back to the English one where
 * it does not, so an untranslated entry shows in English instead of
 * disappearing. `isFallback` tells a section when that happened.
 *
 * Sorting lives here rather than in the sections, so the home page and the
 * dedicated page cannot drift into different orders — they call the same
 * function and one passes a limit.
 */

type Entry<C extends CollectionKey> = CollectionEntry<C>;

/** `it/01-kpmg-intern` → `it`. */
export function entryLocale(entry: { id: string }): Locale {
  return toLocale(entry.id.split('/')[0]);
}

/** `it/01-kpmg-intern` → `01-kpmg-intern`; for projects this is the URL slug. */
export function entryKey(entry: { id: string }): string {
  return entry.id.split('/').slice(1).join('/');
}

/** True when an entry shown for `locale` is the English fallback. */
export function isFallback(entry: { id: string }, locale: Locale): boolean {
  return entryLocale(entry) !== locale;
}

async function localized<C extends CollectionKey>(name: C, locale: Locale): Promise<Entry<C>[]> {
  const byKey = new Map<string, Entry<C>>();
  for (const entry of (await getCollection(name)) as Entry<C>[]) {
    const entryLang = entryLocale(entry);
    const key = entryKey(entry);
    if (entryLang === locale) byKey.set(key, entry);
    else if (entryLang === defaultLocale && !byKey.has(key)) byKey.set(key, entry);
  }
  return [...byKey.values()];
}

/** Sortable key from `YYYY-MM`; open-ended entries sort first. */
function chronoKey(value: string | undefined): string {
  return value ?? '9999-99';
}

export async function getRoles(locale: Locale): Promise<Entry<'roles'>[]> {
  const roles = await localized('roles', locale);
  return roles.sort((a, b) => b.data.start.localeCompare(a.data.start));
}

export async function getEducation(locale: Locale): Promise<Entry<'education'>[]> {
  const education = await localized('education', locale);
  return education.sort((a, b) => b.data.end.localeCompare(a.data.end));
}

export async function getProjects(locale: Locale): Promise<Entry<'projects'>[]> {
  const projects = await localized('projects', locale);
  return projects.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects(locale: Locale): Promise<Entry<'projects'>[]> {
  return (await getProjects(locale)).filter((project) => project.data.featured);
}

export async function getCertifications(locale: Locale): Promise<Entry<'certifications'>[]> {
  const certifications = await localized('certifications', locale);
  return certifications.sort((a, b) => chronoKey(b.data.earned).localeCompare(a.data.earned));
}

export async function getSkills(locale: Locale): Promise<Entry<'skills'>[]> {
  const skills = await localized('skills', locale);
  return skills.sort(
    (a, b) => a.data.order - b.data.order || a.data.group.localeCompare(b.data.group),
  );
}

export async function getNow(locale: Locale): Promise<Entry<'now'>> {
  const [entry] = await localized('now', locale);
  if (!entry) throw new Error('src/content/now/en/now.md is missing');
  return entry;
}

/**
 * A project earns a detail page only if it has a body. This is what stops
 * thin entries from generating empty pages.
 */
export function hasCaseStudy(project: Entry<'projects'>): boolean {
  return (project.body ?? '').trim().length > 0;
}

/** The short mono line above a project title: period, who built it, status. */
export function projectMeta(project: Entry<'projects'>, locale: Locale): string[] {
  const { period, role, status } = project.data;
  const statusLabel = status && useTranslations(locale).projects.status[status];
  return [period, role, statusLabel].filter((part): part is string => Boolean(part));
}

/** Confidential projects never expose repository or demo links. */
export function publicLinks(project: Entry<'projects'>): [string, string][] {
  if (project.data.confidential) return [];
  return Object.entries(project.data.links).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  );
}

/** `2023-04` -> `Apr 2023` (English) or `apr 2023` (Italian). */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(localeTags[locale].intl, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

/** Open-ended ranges read as "Present" rather than trailing off. */
export function formatRange(start: string, end: string | undefined, locale: Locale): string {
  const present = useTranslations(locale).dates.present;
  return `${formatMonth(start, locale)} — ${end ? formatMonth(end, locale) : present}`;
}

/** A full date, e.g. "17 November 2026" / "17 novembre 2026". */
export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(localeTags[locale].intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
