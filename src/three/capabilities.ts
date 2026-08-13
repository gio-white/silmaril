/**
 * Gates a scene must pass before any WebGL code is even *fetched*.
 * Failing any of them leaves the static poster in place, which is a real
 * drawing of the same scene and looks deliberate rather than broken.
 *
 * The 48rem floor matches the CSS: below that the canvas is never shown, so
 * downloading ~120kB of three.js would be pure waste.
 */

const MIN_VIEWPORT = '(min-width: 48rem)';
const REDUCE_MOTION = '(prefers-reduced-motion: reduce)';

export function canLoadScene(): boolean {
  if (window.matchMedia(REDUCE_MOTION).matches) return false;
  if (!window.matchMedia(MIN_VIEWPORT).matches) return false;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return false;

  if ((navigator.hardwareConcurrency ?? 8) < 4) return false;

  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    return gl !== null;
  } catch {
    return false;
  }
}
