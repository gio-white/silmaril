/**
 * Scroll-spy for the axis gutter.
 *
 * This is the one thing on the site that genuinely needs JavaScript. CSS
 * scroll-driven animations can animate an element against its *own* position,
 * but marking a tick elsewhere in the DOM as active requires `timeline-scope`,
 * which is still incomplete even where scroll-driven animation has shipped.
 * An IntersectionObserver is ~600 bytes and works everywhere.
 *
 * Only runs on pages whose gutter is in scroll mode. The site-level variant on
 * subpages marks its current page server-side and needs nothing here.
 */

const ACTIVE = 'is-current';

export function initAxis(): void {
  const axis = document.querySelector<HTMLElement>('[data-axis="scroll"]');
  if (!axis) return;

  const ticks = new Map<string, HTMLElement>();
  for (const tick of axis.querySelectorAll<HTMLElement>('[data-axis-tick]')) {
    const id = tick.dataset.axisTick;
    if (id) ticks.set(id, tick);
  }
  if (ticks.size === 0) return;

  const sections = [...ticks.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  const visible = new Set<string>();

  function paint(): void {
    // With several sections on screen at once, the topmost wins — it matches
    // where the reader's attention is, and it stops the marker flickering
    // between neighbours near a boundary.
    let current: string | undefined;
    for (const section of sections) {
      if (visible.has(section.id)) {
        current = section.id;
        break;
      }
    }

    for (const [id, tick] of ticks) {
      const isCurrent = id === current;
      tick.classList.toggle(ACTIVE, isCurrent);
      if (isCurrent) {
        tick.setAttribute('aria-current', 'true');
      } else {
        tick.removeAttribute('aria-current');
      }
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.add(entry.target.id);
        } else {
          visible.delete(entry.target.id);
        }
      }
      paint();
    },
    {
      // Ignore the top strip under the sticky header and the bottom third, so
      // a section counts as current while it occupies the reading area rather
      // than the moment one pixel of it appears.
      rootMargin: '-72px 0px -55% 0px',
      threshold: 0,
    },
  );

  for (const section of sections) observer.observe(section);
}
