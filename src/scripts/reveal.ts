/**
 * IntersectionObserver fallback for [data-reveal], used only when the
 * inline head script has already decided CSS scroll-driven animations are
 * unavailable (it sets data-reveal-js on <html> before first paint).
 *
 * Default CSS leaves every [data-reveal] visible, so this is an enhancement
 * rather than a requirement: if it never runs, the page is complete.
 */

export function initReveal(): void {
  if (!document.documentElement.hasAttribute('data-reveal-js')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const item of items) observer.observe(item);
}
