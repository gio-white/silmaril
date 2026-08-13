/**
 * Theme toggle behaviour.
 *
 * Three states rather than two: a light/dark switch permanently strands anyone
 * who wants to follow their operating system, which is most people.
 *
 * The heavy lifting is done by CSS. This only writes `data-theme` on <html>,
 * which flips `color-scheme`, which resolves every light-dark() token — plus
 * native scrollbars, form controls and caret colour. Removing the attribute
 * returns control to the OS.
 *
 * The no-flash script that reads localStorage before first paint lives inline
 * in BaseLayout.astro; it has to run before the document renders, so it cannot
 * be in this deferred module.
 */

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

function apply(choice: ThemeChoice): void {
  if (choice === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
  syncThemeColor();
}

/**
 * Keep <meta name="theme-color"> in step so mobile browser chrome matches.
 * The rendered value is read back from the page rather than duplicated here,
 * so the palette stays defined in exactly one place.
 */
function syncThemeColor(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) return;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  if (bg) meta.content = bg;
}

function store(choice: ThemeChoice): void {
  try {
    if (choice === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, choice);
    }
  } catch {
    // Private browsing or blocked storage. The choice still applies for this
    // page view; it just will not persist. Not worth surfacing to the user.
  }
}

function read(): ThemeChoice {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* see above */
  }
  return 'system';
}

export function initThemeToggle(root: ParentNode = document): void {
  const inputs = root.querySelectorAll<HTMLInputElement>('input[name="theme-choice"]');
  if (inputs.length === 0) return;

  const current = read();
  for (const input of inputs) {
    input.checked = input.value === current;
    input.addEventListener('change', () => {
      if (!input.checked) return;
      const choice = input.value as ThemeChoice;
      apply(choice);
      store(choice);
    });
  }

  // While following the system, track OS changes so theme-color stays correct.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (read() === 'system') syncThemeColor();
  });

  syncThemeColor();
}
