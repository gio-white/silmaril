# Functional audit — November 2026

Phase 0 of the plan of action. The first time the site was run rather than read:
production build (`pnpm build` + `pnpm preview`) driven with Playwright/Chromium at 1440×900, 375×812
and 360×760 (touch), in light, dark and reduced-motion modes, plus Lighthouse 12 on the home page and
one case study.

## Baseline

| Check | Result |
| --- | --- |
| `pnpm check` | Pass. 0 errors, 0 warnings, 5 hints (unused `Props` interfaces in sections) |
| `pnpm build` | Pass. 6 pages, all size budgets within limits |
| Lighthouse, home, mobile / desktop | 100 / 100 / 100 / 100 (performance, accessibility, best practices, SEO) |
| Lighthouse, case study, mobile / desktop | 100 / 100 / 100 / 100 |
| Console errors | None on any page (WebGL software-fallback warnings are the headless GPU, not the site) |
| Internal links | All resolve (`/`, `/projects`, both case studies, `/experience`, `/skills`, `/cv.pdf`) |
| In-page anchors | Every `#…` link has a target on its page, including `#contact` on every route |

## Page-by-page

| Area | Result |
| --- | --- |
| Home hero | Renders. Live canvas on desktop; poster on mobile and under reduced motion. "Get in touch" is a `mailto:`; "Download CV" serves `application/pdf` |
| Home "see all" links | Appear only when truncated: Projects (3 of 4 featured), Experience (2 of 3), Skills (4 of 7), Certifications (3 of 4) |
| Home axis gutter | Tracks the section in view (scrolled to Experience → Experience current) |
| `/projects` | Four cards. Titles link only for projects with a body (two of four) |
| `/projects/<slug>` | Markdown renders (headings, table). Back link to `/projects`. Title, description, OG tags per page |
| `/experience` | Roles newest first, current role reads "Present", education below |
| `/skills` | Seven groups; certifications with expiry shown as a word ("Expired …"), not colour alone |
| Navigation | Correct `aria-current` on every page, `/projects/<slug>` counted as Projects |
| Theme | Light / system / dark persists across navigation; `data-theme` is set before first paint (no flash) |
| Keyboard | First Tab is the skip link; every focus stop has a visible 2px outline; theme radios are one tab stop |

## Bugs

### Broken

None.

### Wrong

1. **Mobile header wrapped to three rows.** At 360–414px the five nav items did not fit on one line
   (Contact wrapped), so the sticky header was 131px tall: a sixth of a phone screen. `nav.ts` states
   the items fit on one line on a phone. *Repro:* open any page at 375px wide. *Fix:* tighter nav
   column gap below 30rem; header is now 99px with the nav on one line.
   **Fixed.**
2. **No 404 page.** An unknown URL returns Astro's bare default "404: Not Found". *Repro:* open
   `/does-not-exist`. Planned in Phase 1.
3. **Canonical and OG URLs point to `example.com`.** `site` in `astro.config.mjs` is a placeholder.
   *Repro:* view source on any page. Needs the domain; planned in Phase 9.

### Cosmetic

1. **Dangling separator in the hero on phones.** "Milan, Italy ·" with the availability wrapped below,
   leaving the dot at the end of the first line. *Repro:* home at 375px. *Fix:* the two items stack and
   the dot is hidden below 30rem.
   **Fixed.**
2. **Gaps in full-page screenshots.** Section headers look missing in full-page captures. Not a bug:
   they use scroll-driven reveal animations and are at opacity 0 until scrolled into view, which a
   full-page capture never does. Verified visible after scrolling.

## Content (fixed in Phase 4, not here)

Every name, role, project, metric, certification and link is placeholder. Two case studies display a
"PLACEHOLDER case study" heading; `public/cv.pdf` is a placeholder; one certification shows as expired.

## Re-run after fixes

Checklist re-run on the rebuilt site: header 99px at 360/375/414px with the nav on one line, hero meta
stacked, no console errors, all links and anchors resolve, budgets within limits.
