/**
 * Scroll-spy for the axis gutter.
 *
 * This is the one thing on the site that genuinely needs JavaScript. CSS
 * scroll-driven animations can animate an element against its *own* position,
 * but marking a tick elsewhere in the DOM as active requires `timeline-scope`,
 * which is still incomplete even where scroll-driven animation has shipped.
 *
 * Deliberately computed from bounding rects rather than from
 * IntersectionObserver visibility. An observer answers "is this section on
 * screen", which is the wrong question: with tall sections, several are on
 * screen at once and near the top of the page none of them are inside a tuned
 * rootMargin band, so no tick lights up at all. Reading positions against a
 * single anchor line answers "which section am I reading", which is the
 * question the axis is actually asking, and it is deterministic.
 *
 * Cost is trivial — a handful of getBoundingClientRect calls, rAF-throttled,
 * on a passive listener.
 */

const ACTIVE = 'is-current';

/** Fraction of the viewport height used as the reading line. */
const ANCHOR_RATIO = 0.35;

export function initAxis(): void {
  const axis = document.querySelector<HTMLElement>('[data-axis="scroll"]');
  if (!axis) return;

  const ticks = new Map<string, HTMLElement>();
  for (const tick of axis.querySelectorAll<HTMLElement>('[data-axis-tick]')) {
    const id = tick.dataset.axisTick;
    if (id) ticks.set(id, tick);
  }

  const sections = [...ticks.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (sections.length === 0) return;

  let painted: string | undefined;

  function activeId(): string | undefined {
    // The last section to have crossed the reading line is the one being read.
    const anchor = window.innerHeight * ANCHOR_RATIO;
    let active: string | undefined;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= anchor) active = section.id;
    }

    // The final section is often too short to reach the anchor before the page
    // stops scrolling, which would leave the last tick permanently unlit.
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (atBottom) active = sections[sections.length - 1]?.id;

    return active;
  }

  function paint(): void {
    const current = activeId();
    if (current === painted) return;
    painted = current;

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

  let queued = false;
  function schedule(): void {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      paint();
    });
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  paint();
}
