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
 */

export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/skills', label: 'Skills' },
];

export const contactItem: NavItem = { href: '#contact', label: 'Contact' };

/**
 * Secondary pages, linked from the footer. The header stays at four items plus
 * Contact so it still fits on one line on a phone.
 */
export const secondaryItems: NavItem[] = [
  { href: '/now', label: 'Now' },
  { href: '/cv', label: 'CV' },
];

/** Ticks for the site-level axis on dedicated pages. */
export const axisSiteItems = navItems.map((item) => ({ target: item.href, label: item.label }));

/** Ticks for the scroll axis on the home page. */
export const axisHomeItems = [
  { target: 'about', label: 'About' },
  { target: 'projects', label: 'Projects' },
  { target: 'experience', label: 'Experience' },
  { target: 'skills', label: 'Skills' },
  { target: 'certifications', label: 'Credentials' },
  { target: 'contact', label: 'Contact' },
];

/** Marks the active nav item, treating /projects/<slug> as within /projects. */
export function isActive(itemHref: string, pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (itemHref === '/') return path === '/';
  return path === itemHref || path.startsWith(`${itemHref}/`);
}
