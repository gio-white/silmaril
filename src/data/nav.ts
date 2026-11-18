/**
 * Site navigation, defined once.
 *
 * Four destinations plus a contact anchor. Contact is deliberately not a page:
 * a separate contact route adds a click at the exact moment someone has
 * decided to reach out. Because every page ends with the contact section,
 * `#contact` resolves wherever the visitor happens to be.
 *
 * Four items fit on one line on a phone, which is why there is no hamburger —
 * hiding navigation behind a tap buys nothing at this size.
 *
 * Labels are keys into the `nav` dictionary in src/i18n; hrefs are the
 * English paths, localised where they are rendered.
 */
import type { Dictionary } from '../i18n/en';

export type NavKey = keyof Dictionary['nav'];

export interface NavItem {
  href: string;
  key: NavKey;
}

export const navItems: NavItem[] = [
  { href: '/', key: 'home' },
  { href: '/projects', key: 'projects' },
  { href: '/experience', key: 'experience' },
  { href: '/skills', key: 'skills' },
];

export const contactItem: NavItem = { href: '#contact', key: 'contact' };

/**
 * Secondary pages, linked from the footer. The header stays at four items plus
 * Contact so it still fits on one line on a phone.
 */
export const secondaryItems: NavItem[] = [
  { href: '/now', key: 'now' },
  { href: '/cv', key: 'cv' },
];

export interface AxisEntry {
  /** Section id for scroll mode, or the English href for site mode. */
  target: string;
  key: NavKey;
}

/** Ticks for the site-level axis on dedicated pages. */
export const axisSiteItems: AxisEntry[] = navItems.map((item) => ({
  target: item.href,
  key: item.key,
}));

/** Ticks for the scroll axis on the home page. */
export const axisHomeItems: AxisEntry[] = [
  { target: 'about', key: 'about' },
  { target: 'projects', key: 'projects' },
  { target: 'experience', key: 'experience' },
  { target: 'skills', key: 'skills' },
  { target: 'certifications', key: 'credentials' },
  { target: 'contact', key: 'contact' },
];

/** Marks the active nav item, treating /projects/<slug> as within /projects.
 *  Takes a path with the locale prefix already removed. */
export function isActive(itemHref: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (itemHref === '/') return path === '/';
  return path === itemHref || path.startsWith(`${itemHref}/`);
}
