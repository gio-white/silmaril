import { en } from './en';
import { it } from './it';

/**
 * Locales, URL helpers and the interface dictionaries.
 *
 * English is the default and lives at the root (`/projects`); Italian lives
 * under `/it/` (`/it/projects`). Components read the locale from
 * `Astro.currentLocale`, so it never has to be passed down as a prop.
 */

export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** BCP 47 tags for Intl, <html lang> and og:locale. */
export const localeTags: Record<Locale, { lang: string; intl: string; og: string; name: string }> =
  {
    en: { lang: 'en', intl: 'en-GB', og: 'en_GB', name: 'English' },
    it: { lang: 'it', intl: 'it-IT', og: 'it_IT', name: 'Italiano' },
  };

const dictionaries = { en, it };

export function toLocale(value: string | undefined): Locale {
  return (locales as readonly string[]).includes(value ?? '') ? (value as Locale) : defaultLocale;
}

/** The interface strings for a locale. */
export function useTranslations(locale: Locale) {
  return dictionaries[locale];
}

/** `/projects` → `/it/projects` for Italian; unchanged for English. Hashes
 *  and external URLs pass through untouched. */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/')) return path;
  const bare = stripLocale(path);
  if (locale === defaultLocale) return bare;
  return bare === '/' ? `/${locale}/` : `/${locale}${bare}`;
}

/** `/it/projects/` → `/projects/`. */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname === `/${locale}/`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname;
}
