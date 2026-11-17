---
description: Run the full pre-merge checklist (check, build, budgets, browser audit)
---

Run the release checklist for the current branch and report each item as pass or fail.

1. `pnpm check`: Biome and `astro check` clean.
2. `pnpm build`: succeeds, and the size budgets at the end report "All budgets within limits".
3. Serve the build (`pnpm preview`) and drive it in a browser (Playwright), at 1440×900 and
   360×760, in light and dark:
   - Every route renders with one `<h1>`, its own title and description, and no console errors:
     `/`, `/projects`, each `/projects/<slug>`, `/experience`, `/skills`, and an unknown URL
     (expects the custom 404 page with a 404 status).
   - Every internal link returns 200; every `#anchor` has a target; `#contact` resolves on every
     page.
   - The nav marks the current page; the theme choice persists across navigation with no flash.
   - No horizontal overflow at 360px.
4. Run `pnpm check:launch` and list any placeholders it reports. Before go-live it must pass.
5. If content changed, confirm `public/cv.pdf` was regenerated with `pnpm cv:pdf`.
6. Check that `CHANGELOG.md` has an entry for this branch and that `docs/` matches any structural
   change.

Summarise the result as a short table, with screenshots of anything that failed.
