# Design review — November 2026

Phase 7 of [`plan-of-action.md`](plan-of-action.md): `/impeccable audit` and `/impeccable critique`
on the home page, a case study, `/experience` and the phone layout, on the real content in both
languages and both themes.

> ⚠️ **Degraded run: single context, no detector.** Impeccable's launcher (which runs its
> deterministic detector) was blocked by the session's sandbox, and its critique normally uses two
> isolated sub-agents, which this session does not spawn without being asked. The review below is
> one reviewer's reading of the rendered pages, checked with measurements (Playwright at 1440×900
> and 390×844 with touch, light and dark, English and Italian) and Lighthouse. Rerun
> `/impeccable audit` and `/impeccable critique` locally to get the detector's findings.

## Audit health

| # | Dimension | Score | Key finding |
| --- | --- | --- | --- |
| 1 | Accessibility | 3 → 4 | Footer, contact and case-study links were 14–15px tall on touch screens, under the design system's own 44px floor. **Fixed.** |
| 2 | Performance | 4 | Lighthouse 100 on every audited page; budgets enforced at build; 3D chunk lazy and gated. |
| 3 | Theming | 3 | Project covers are not theme-aware: a light cover is a bright panel in dark mode. |
| 4 | Responsive | 3 | On phones the sticky header is two rows (103px, 12% of an 844px screen). |
| 5 | Implementation integrity | 3 | Coherent token system and one accent; the mono label above every heading repeats the heading. |
| | **Total** | **16 → 17 / 20** | **Good** |

**Integrity verdict: pass.** The site expresses one specific system: the drafting-paper palette, the
axis gutter that turns into a progress rail, mono only for dates, tags and measurements, a single
rust accent for thresholds. Nothing is interchangeable with a generic portfolio template. The
weakest systemic habit is that every section opens with a mono label that restates its heading.

## Critique

Surface mode: **Experience** (a personal site and portfolio). Heuristics 7 and 10 are `n/a`: there
is no expert workflow to accelerate and nothing that needs help text.

| # | Heuristic | Score | Key issue |
| --- | --- | --- | --- |
| 1 | Visibility of system status | 3 | Nav, axis and language switch all mark the current place; nothing to load. |
| 2 | Match with the real world | 4 | Plain language, CV conventions, dates as people write them in each language. |
| 3 | User control and freedom | 3 | Language switch keeps the page; theme persists; skip link. |
| 4 | Consistency and standards | 3 | Labels vs titles disagree ("Stack" above "What I work with", nav says "Skills"). |
| 5 | Error prevention | 3 | Little to prevent; 404 is designed and links home. |
| 6 | Recognition rather than recall | 3 | On a phone the home page is 7,464px; sections are far apart. |
| 7 | Flexibility and efficiency | n/a | No expert workflow. |
| 8 | Aesthetic and minimalist design | 3 | Home project cards repeat the full problem / approach / outcome. |
| 9 | Error recovery | 3 | 404 in both languages, with home and contact links. |
| 10 | Help and documentation | n/a | Nothing needs help. |
| | **Total** | **25 / 32** | **Good** |

**Design specificity:** strong. The axis and signal-surface hero belong to this person's subject
(data that has to be trustworthy), and the restraint reads as deliberate, not empty.

**Strengths**

- The hero says who, what and where in one screen, with the action (email) and the CV one tap
  away, in both languages.
- Typography carries the hierarchy: expanded Archivo headings against Public Sans prose, with mono
  rationed to measurements.
- The contact block is the clearest thing on every page, and it closes every page.

**Emotional journey:** the peak is the hero and the end is the contact block, which is the right
shape. The valley is the middle of the home page on a phone: three full project write-ups in a
row before reaching work history.

**Personas**

- *Recruiter on a phone between meetings:* finds role, location, availability and CV in the first
  screen. Reaching the work history takes a long scroll past project detail.
- *Hiring engineer on a laptop:* wants depth; gets it in the case study and the role highlights.
  Would want more measured outcomes in the KPMG roles (open item in `content-source.md`).
- *Italian-speaking client:* switches language once and stays in Italian on every page.

## Findings

### P1

1. **The home page is not condensed on phones.** *Where:* `src/sections/03-Projects.astro` on `/`.
   *Impact:* each home project card shows the full problem, approach and outcome, so the page is
   7,464px at 390px wide and work history starts far down. The home page's own comment says every
   section appears there "in condensed form". *Recommendation:* on the home page, show title,
   meta, summary and outcome only; keep the full card on `/projects`. *Command:* `/impeccable
   distill`. **Not applied: it changes what the home page shows, so it is your call.**

### P2

2. **The phone header is two rows.** *Where:* `BaseLayout.astro`. *Impact:* 103px of sticky chrome
   on an 844px screen. *Recommendation:* below 30rem, unpin the header (as landscape phones already
   do), or fold the language and theme controls into one compact control. *Command:* `/impeccable
   adapt`.
3. **Project covers ignore the theme.** *Where:* `.project__cover`, `.case__cover`. *Impact:* a
   light screenshot glares on the dark page. *Recommendation:* an optional `coverDark` image in the
   schema, or a dimmed frame in dark mode. *Command:* `/impeccable harden`.
4. **Every heading has a label that repeats it.** *Where:* `Section.astro`. "Credentials /
   Certifications", "Experience / Where I've worked", "Stack / What I work with". Impeccable bans
   eyebrows outright; here they are part of the axis language in `docs/design-system.md`, so this
   is a design decision, not a bug. *Recommendation:* either drop the label where it restates the
   heading, or make it carry information (a count, a date range). *Command:* `/impeccable
   distill`.

### P3

5. **The metric strip is a template pattern with small numbers.** "2+ / 8 / 5 / ~5" in accent
   colour reads as filler. Stronger figures (users of the Power BI app, data volume, agent pilot
   users) would earn the strip; until then a sentence may do more. *Command:* `/impeccable
   clarify`.

### Fixed in this phase

- **44px touch targets** for the footer links, contact rows, the case-study back and repository
  links, and the `/cv` contacts, under `(pointer: coarse)`, matching the design system's floor.

## Positive findings to keep

- Contrast, focus rings, reduced motion and landmarks are solid: Lighthouse accessibility 100.
- Text selection, underline offset and focus ring are themed from the palette, not browser
  defaults.
- Budgets are enforced by the build, so performance cannot quietly regress.
- No horizontal overflow at 360px in either language.

## Recommended next steps

1. **[P1] `/impeccable distill`** the home project cards (needs your yes).
2. **[P2] `/impeccable adapt`** the phone header.
3. **[P2] `/impeccable harden`** project covers for dark mode, once real covers exist.
4. **[P2] `/impeccable distill`** the section labels (needs your decision).
5. **`/impeccable polish`** as the final pass after those.

## Questions for Giorgio

- Should the home page show condensed project cards (title, summary, outcome) and leave the full
  write-up to `/projects`?
- Keep the mono label above each section heading, drop it where it repeats the heading, or make it
  carry a fact?
- On phones: unpin the header, or keep it sticky and make the controls more compact?
