# Changelog

What changed and, more importantly, why. The diff already shows which files moved; this records
the reasoning, so entries lead with the motivation rather than a file list.

Newest first.

---

## Go-live runbook (Phase 9 preparation)

Launch waits only on the domain now, so `docs/go-live.md` turns Phase 9 into a checklist:
buying and attaching the domain, the one-line `site` change that fixes every absolute URL, HSTS
starting at one day, making the placeholder guard strict, production checks, and Search Console.

---

## Phase 7: design review on the real content

`docs/design-review.md` records an Impeccable-style audit and critique of the home page, a case
study, `/experience` and the phone layout, in both languages and both themes. The audit scores
17 / 20, the critique 25 / 32. It was a single-context run without Impeccable's detector, which
could not run in the cloud session; rerunning both commands locally will add its findings.

**Fixed: touch targets.** The design system sets a 44px floor on touch screens, but footer
links, contact rows, the case-study back and repository links and the `/cv` contacts were 14–15px
tall. Under `(pointer: coarse)` they now reach 44px without changing how they look with a mouse.

**Not fixed, waiting for a decision:** condensing the home page's project cards (on a phone the
page is 7,464px long), the two-row sticky header on phones, dark-mode handling for project covers,
and whether the mono label above each heading should stay. The review lays out the options.

---

## Phase 8: sitemap, robots.txt, structured data and analytics

The site was built for link sharing first, so search-engine plumbing was deferred. With two
languages and a launch coming, it is in now.

**`sitemap-index.xml`** lists every page in both languages, each with its translation as an
`hreflang` alternate; the 404 pages are left out. It comes from `@astrojs/sitemap` (new
dependency, the official integration). **`robots.txt`** is generated, so its sitemap URL follows
the real domain once `site` changes.

**A schema.org `Person`** on both home pages ties the site to the LinkedIn and GitHub profiles:
name, role, employer, city, languages, the main skills and the certifications. It is a JSON data
block, which browsers do not execute, so it needs no CSP hash.

**Titles and descriptions are unique** on every page within each language (checked on the build).

**Cloudflare Web Analytics** is cookieless and needs no consent banner. Cloudflare injects its
beacon at the edge once it is switched on in the Pages dashboard, so the only repo change is the
CSP: `static.cloudflareinsights.com` for the script and `cloudflareinsights.com` for the beacon.

---

## Phase 6: English and Italian

The site now exists in both languages, before launch, because the URL shapes are fixed by this and
changing them later would cost redirects.

**English stays at the root; Italian lives under `/it/`.** Every page has an Italian twin, and the
header has an EN / IT switch that keeps you on the same page. `<html lang>`, `hreflang` alternates
with an `x-default`, and `og:locale` tell search engines and link previews which is which.

**Interface strings are typed dictionaries** (`src/i18n/en.ts`, `it.ts`): a key missing in Italian
is a type error, not a blank on the live site. Dates come from `Intl.DateTimeFormat` in the page's
language.

**Content is split into `en/` and `it/` folders** per collection, and the profile has prose per
language. Everything is drafted in Italian now, for Giorgio to review. Anything left untranslated
later shows in English with a short note rather than vanishing, and `pnpm check:translations`
lists it as a CI warning. Certifications stay English-only: their names are official titles.

**Pages became shared views** in `src/views/`, with a thin route file per language, so a page's
markup exists once.

**Two build details.** Astro writes the Italian 404 to `it/404/index.html`, but Cloudflare Pages
looks for the nearest `404.html`, so the build moves it. The 404 pages are now `noindex`, without
canonical or alternate links. And on a 360px phone the longer Italian labels wrapped the nav, so
below 24rem the nav drops its letter-spacing.

**The CV prints in both languages:** `pnpm cv:pdf` writes `cv.pdf` and `cv-it.pdf`, and each
language's "Download CV" links to its own.

---

## /cv and /now (Phase 10, brought forward)

**The CV is now a page, and the PDF is printed from it.** `/cv` is built from the same collections
as the rest of the site, so the CV and the site cannot disagree. Its print stylesheet hides the
site chrome, scales the type down from the root (every size is in rem), and lays it out on two A4
pages. `pnpm cv:pdf` serves the build locally and prints that page to `public/cv.pdf` with a local
Chrome. It is a manual step rather than part of `pnpm build` because Cloudflare's build image has
no browser; the architecture rule and `/release-check` both say to run it after content changes.
`playwright-core` is a new dev dependency for this, pinned and without a bundled browser.

**`/now`** says what Giorgio is focused on, from one Markdown file whose `updated` date is shown on
the page.

**Both live in the footer**, not the header: four items plus Contact is what fits on one line on a
phone.

---

## Phase 5: richer project entries

Project cards could only say what a project was, not when, by whom, or whether it still exists.
The schema now carries that, so real projects can land without another model change.

**New optional fields:** `period`, `role` and `status` render as a mono line above the title;
`tags` (topics, as opposed to the `stack` tools) appear on the case study; `cover` adds an image
with required alt text; `confidential` hides repository and demo links and says details are
anonymised; `kind` separates client work from side projects in one collection, so a future `/lab`
page is a filter rather than a second content model.

**Covers are served as AVIF at three widths** through `astro:assets`, with a fixed 16:9 frame so
a late image never shifts the card. Astro does not process SVG sources, so an authored SVG cover
goes through `pnpm rasterize` to a PNG first, like the hero posters.

**The samples exercise every variant:** one with a cover and a case study, one confidential with
its repo link hidden, one plain.

---

## Phase 4: Giorgio's content replaces the placeholders

Every name, role and metric on the site belonged to a fictional "Alessandro Bernardini". The site
now describes Giorgio, from his CV; `docs/content-source.md` maps every fact to its source and
lists what the CV does not cover yet.

**Positioning widened from "Data Engineer" to "Data & AI Engineer".** The work spans Databricks
platforms, executive Power BI reporting and LLM agents on Microsoft Foundry, and the hero line now
says so. Copy that was hard-wired to data engineering (the projects page description, schema
comments, the intake template) is neutral.

**Client work lives in the work history, anonymised.** The three KPMG roles describe the programme
for "a multinational agricultural machinery manufacturer" without naming it, with no internal
figures. Highlights carry numbers only where the CV has them; nothing is invented.

**`/projects` is reserved for public projects.** Until those exist it shows three clearly marked
fictional samples, chosen to exercise the layout: one with a full case study and a repo link, one
with a repo link and no case study, one with neither.

**A launch guard.** `pnpm check:launch` fails while `PLACEHOLDER` or `example.com` remain in
`src/`, `public/` or the Astro config. CI runs it warn-only, so sample content can sit on a
branch, and the go-live checklist runs it strictly.

**Education can omit its start year**, because the CV gives only the graduation date for the
degree. Skills are regrouped around the real profile, and spoken languages are listed.

**Share card and favicon.** `og.png` carries the new name and line, re-laid out so nothing
collides; the favicon is a "GB" monogram on the axis. `pnpm rasterize` no longer writes a
placeholder `cv.pdf`, which would have overwritten the real one; the CV PDF now comes from `/cv`.

---

## Phase 3: inline scripts allowed by hash, not by `'unsafe-inline'`

`script-src 'unsafe-inline'` meant any script injected into a page would run. The site has no
user input today, so this is defence in depth, but it is the one CSP weakness that costs almost
nothing to close.

**`pnpm build` now hashes the inline scripts it emitted.** `scripts/csp-hashes.mjs` reads every
page in `dist/`, takes the SHA-256 of each inline `<script>` (the no-flash theme script and three
small modules Astro inlines), and writes them into `dist/_headers` in place of a placeholder.
Hashing the built output means the allow-list cannot drift from what ships. If the step were ever
skipped, the placeholder is not valid CSP, so browsers block inline scripts rather than allowing
them: the failure is loud, not silent. Why this and not Astro's built-in CSP is in
`docs/decisions.md`.

**Verified in a browser with the real header applied:** theme toggle, scroll-spy axis, 3D hero and
both reveal modes work with no CSP violations, and a policy without the hashes does report them,
so the test is real.

The standing security guideline from the plan went into `CLAUDE.md` in Phase 1. HSTS waits for the
custom domain (Phase 9); account 2FA and the registrar lock are dashboard settings.

---

## Phase 2: CI, Dependabot, and the deployment flow

Until now nothing checked a change before it reached `main`. The intended flow is: a branch, a
pull request, CI, a Cloudflare preview, Giorgio's review, merge, live.

**CI runs the definition of done on every pull request.** `.github/workflows/ci.yml` installs with
`--frozen-lockfile`, then runs `pnpm check` and `pnpm build` (which includes the size budgets) on
the Node version in `.nvmrc`. Two more gates cover what the build cannot: an offline link check of
`dist/` (internal links only, so a slow external site cannot fail a PR) and Lighthouse CI on four
pages. Accessibility, best practices and SEO fail below their thresholds; performance only warns,
because CI runners vary too much for a hard performance gate.

**The workflow can only read the repository**, and every third-party action is pinned to a commit
with the tag in a comment. A moved tag cannot change what runs.

**Dependabot opens grouped update PRs weekly**, for npm and for the workflow's actions, so a
normal week is one or two PRs rather than ten. CI validates each one.

**`README.md` documents the dashboard steps the repo cannot do itself**: connecting the Cloudflare
Pages project, the `main` ruleset, the security toggles, and how to roll back a bad deploy.

---

## Phase 1: Claude Code replaces Cursor, and a 404 page

The project is now worked on with Claude Code only, so its instructions moved to where Claude
Code reads them.

**`CLAUDE.md` holds the essentials; the long rules live in `.claude/rules/`.** The three Cursor
rules became a root `CLAUDE.md` (stack, commands, never-do list, definition of done, commit style)
plus `architecture.md` and `design-system.md` under `.claude/rules/`, which Claude Code loads
automatically. Nothing in them changed except file references. `AGENTS.md` was Astro's stock
boilerplate; it is now a pointer to `CLAUDE.md` for any other agent.

**A standing security guideline.** `CLAUDE.md` now carries the rules from the plan's Phase 3.1:
server-side validation for any future form, no raw HTML from untrusted input, no secrets in the
repo, every new external origin goes through the CSP, least privilege, and no personal data or
unanonymised client work on the site. They apply to every later change, not just one phase.

**`.cursor/skills/` is gone.** 146 files and 2.9 MB of third-party design skills that the site
never used. The `__pycache__` ignore lines existed only for their scripts.

**Two design skills replace them, chosen for the design phases.** Anthropic's `frontend-design`
and Paul Bakaus's Impeccable (v4.9.2) are vendored into `.claude/skills/`, so every session and
contributor gets the same version. Impeccable is installed as a skill only: its optional design
hook would run a downloaded binary on every file an agent edits, which is more than a static site
needs to trust by default. It can be added later with `npx impeccable install`.

**A 404 page.** Unknown URLs showed Astro's bare "404: Not Found". The new page uses the site's
layout, links home, and ends with the contact section so the header's `#contact` link still works.
Cloudflare Pages serves `dist/404.html` with a 404 status for any path that matches no file.

**The plan is in the repo.** `docs/plan-of-action.md` tracks every phase, with the boxes ticked as
work lands and the decisions taken so far recorded. Two project commands help with recurring work:
`/add-project` and `/release-check`.

---

## Phase 0: first functional audit

The site had been reviewed by reading the source, never by running it. This pass drove the
production build in a real browser (desktop, phone, dark, reduced motion) and ran Lighthouse;
the full results are in `docs/audit-2026.md`. Lighthouse scores 100 across the board, and nothing
is broken. Two layout faults on phones are fixed here.

**The phone nav fits on one line again.** At 360–414px the five items wrapped, and the sticky
header grew to 131px — a sixth of the screen spent on chrome. A tighter column gap below 30rem
keeps them on one line, which is what `nav.ts` already promised; the header is now 99px.

**The hero meta line stacks on phones.** Location and availability wrapped onto two lines with
the separator dot left hanging at the end of the first. Below 30rem they stack and the dot goes.

---

## Motion, posters, share card, and the budget gate

The remaining design work that was still sitting as "implemented in spirit".

**Reveals are one element per section, not one per card.** The design-system rule is
one or two animated elements per view; putting `data-reveal` on every project, role and
cert made a page of staggered cards. The section header now carries the reveal, which is
the thing a reader is actually looking at as they arrive.

**The axis gutter now has its mobile form.** Below 64rem the labelled ticks have no
horizontal room, so they become a 2px rust progress rail on the inline-start edge —
CSS `animation-timeline: scroll()` with a compositor-only `scaleY` fallback. Phone
landscape unpins the sticky header, because a sticky bar plus a 78svh hero was eating
the whole screen.

**Posters are AVIF, with WebP fallback.** The SVG remains the authored source (a
hairline grid is a vector drawing) and `pnpm rasterize` emits the rasters the page
serves. Quality is 40 at 1600×900 so each theme stays under the 35 kB budget (~30 kB).
The light poster is preloaded; it is the LCP image.

**The share card is a designed PNG.** Slack, LinkedIn and WhatsApp ignore SVG unfurls,
so `public/og.png` is a 1200×630 raster of the same axis-and-type composition, with
matching `twitter:image` tags.

**Light `--slate` is now `#4F5963` (6.24:1).** The original `#5B6670` is 5.13:1 on paper
in the abstract, but 12px antialiased labels sampled at 4.23:1 in Lighthouse, which
fails AA. The extra headroom is for subpixel smoothing, not decoration.

**Size budgets run at the end of `pnpm build`.** A regression that used to be a
changelog note is now a failed build. `wrangler.toml` is the repo-side Cloudflare
Pages config; the custom domain still has to be pointed in the dashboard.

The skill's generated spec is persisted at `design-system/personal-site/MASTER.md`,
with `OVERRIDES.md` recording where the implemented tokens diverge (palette, body
face, no Google Fonts). `tokens.css` remains the source of truth for what ships.

---

## Signal surface hero, scene loader, deploy headers

The 3D hero is live, behind the same gates the architecture doc promised.

**A reusable `Scene3D` wrapper owns every performance guardrail** — capability check, lazy
import, poster fallback, pause-when-hidden, theme re-read — so a future Blender/three.js piece
is a scene file rather than a fresh round of mistakes. The signal surface itself is one
96×96 plane, one draw call, displacement in the vertex shader, grid and rust threshold band in
the fragment shader. Colours are resolved from CSS custom properties through a DOM probe,
because `light-dark()` tokens return the specified function string from `getPropertyValue`, not
the used colour.

**Posters are SVG, not captured AVIF.** A hairline grid compresses better as vectors (11 kB
gzip, well under the 35 kB budget) and stays sharp at any DPR. Two posters, one per theme, so a
dark-mode visitor never flashes a light frame. Below 48rem and under `prefers-reduced-motion`
the poster is the whole hero and three.js is never fetched.

**Cloudflare `_headers`** set a strict CSP (shaders are strings, so no `unsafe-eval`),
`nosniff`, `DENY` framing, and year-long immutable cache on hashed `/_astro/` assets.

## Axis gutter actually tracks the section you are reading

The first IntersectionObserver version answered the wrong question — "is this section on
screen". With tall sections several are, and near the top of the page none of them sit inside a
tuned `rootMargin` band, so no tick ever lit up. It now reads bounding rects against a reading
line at 35% of the viewport, rAF-throttled on a passive scroll listener, which is deterministic.
The last section is forced active at the bottom of the page so a short contact block cannot
leave the final tick permanently dark.

## Content model, sections and pages

The site now renders real structure. Six routes: home, `/projects`, `/projects/<slug>`,
`/experience` and `/skills`.

**The limit pattern is live and verified.** Each section takes an optional `limit`; home passes
one, the dedicated page does not, and the "see all" link renders only when the collection is
actually longer than the limit. Confirmed in the built output: home shows 3 of 4 projects with an
"All 4 projects" link, `/projects` shows 4 with no link, home shows 2 experience entries and
`/experience` shows 5 including education. Nothing about which sections deserve a page is
hardcoded — the site reshapes itself as content accumulates.

**Project detail pages are earned, not assumed.** `getStaticPaths` filters on whether the markdown
body is non-empty, so the two placeholder projects with case studies got pages and the two without
did not. That is what stops thin entries generating empty pages.

**The axis gutter has both modes.** On home its ticks are sections and the current one fills via a
~600 byte IntersectionObserver — the one thing here that genuinely needs JavaScript, because
marking a tick elsewhere in the DOM from a section's scroll position needs `timeline-scope`, which
is still incomplete even where scroll-driven animation has shipped. On dedicated pages the ticks
are the pages and the current one is marked server-side. The tick indicates state by *length* as
well as colour, so it is not carrying meaning by hue alone.

**Zod imported directly rather than from `astro:content`.** Astro 7 ships Zod 4 and marks its
re-exported `z` deprecated, which produced 40 hints in `astro check`. Importing `zod` explicitly
and using `z.url()` instead of the deprecated `z.string().url()` clears them.

**`noRedundantRoles` disabled** with the reasoning recorded in `biome.jsonc`: `role="list"` on a
`<ul>` is redundant in the abstract, but Safari removes list semantics as soon as
`list-style: none` is applied, and every styled list here does that. The role is restoring
semantics, not repeating them.

Placeholder content is deliberately awkward — long company names, bullets that wrap to four lines
— so the layout is stress-tested rather than tuned to convenient text.

Measured: home is 8.3 kB gzip HTML against an 18 kB budget, shared CSS 3.9 kB against 12 kB.

## Design system: tokens, self-hosted fonts, base layout, theme toggle

The visual foundation. Nothing here renders content yet; that lands next.

**Fonts are instanced, not shipped whole.** Fontsource's Archivo carries the full variable design
space — 88 kB for the latin subset alone, more than the entire 85 kB font budget. Since only one
width is ever used, `scripts/build-fonts.py` pins `wdth` to 112.5 (SemiExpanded) and narrows
`wght` to 400–700, taking it to 31.5 kB. Keeping the width as an axis over 100–125 would have cost
57 kB, so it is pinned rather than ranged; the expanded cut is the entire reason for choosing
Archivo, so the width is kept and the flexibility is not. Public Sans is narrowed the same way.
Critical path totals **69.6 kB against the 85 kB budget**, with latin-ext declared behind its own
`unicode-range` so most visitors never fetch it.

**Theming uses `light-dark()` rather than a class swap.** The toggle only sets `color-scheme` via
a `data-theme` attribute and every token resolves itself — which also fixes native scrollbars,
form controls and caret colour, none of which a class-swap approach reaches. Each token declares a
plain fallback first, so browsers without `light-dark()` get the light theme rather than nothing.

**Motion defaults to the finished state.** Scroll-driven animations sit inside `@supports` with
elements visible by default, so Firefox — which has not shipped the feature — sees a complete
static page. The opposite default would leave Firefox users staring at invisible content waiting
for an animation that never runs.

**React removed entirely.** See `docs/decisions.md`. In short: the theme toggle is three native
radio inputs, which need no framework and are more accessible without one; and registering the
integration emitted a 191 kB orphan chunk into `dist/` that no page referenced. Measured after
removal: 668 bytes of gzipped JavaScript, both scripts inlined, no JS files emitted.

## TypeScript pinned to 6.x for `astro check`

`pnpm check` needs `@astrojs/check`, which needs TypeScript's programmatic compiler API.
TypeScript 7's native (Go) compiler does not expose that API yet, so installing the latest broke
the typecheck immediately. Pinned to `^6` until `@astrojs/language-server` supports TS 7 —
tracked at withastro/roadmap#1321. Revisit rather than leaving it pinned forever.

## Project documentation and agent rules

Added `.cursor/rules/` (stack, architecture, design-system), `docs/` and this changelog.

Three rules rather than more, each with a distinct job. `stack.mdc` carries the toolchain, the
commands, the things never to do, and the definition of done. `architecture.mdc` carries the
routing, the limit pattern and where each kind of file belongs — this is the one that must be
updated whenever the structure changes. `design-system.mdc` carries tokens, motion tiers,
accessibility floors and the performance budget, and is what keeps the design coherent as
sections get added.

`docs/` is the human-readable counterpart: `architecture.md` and `design-system.md` explain the
reasoning that the rules only assert, `decisions.md` is a decision log recording what was
rejected and why, and `content-intake.md` is a fill-in template for the CV content.

The split exists because rules are read by agents mid-task and need to be terse and directive,
while the docs need to be readable by a person six months from now who has forgotten the context.
`decisions.md` matters most: without it the rejected options get quietly re-litigated.

## Scaffold: Astro 7 + React + TypeScript, pnpm, Biome

Project skeleton with the toolchain settled during planning.

pnpm is enforced three ways — a `packageManager` field, an `only-allow` preinstall guard, and
`engine-strict` in `.npmrc` — so reaching for npm fails loudly instead of quietly producing a
second lockfile.

Node is pinned to `>=22.19.0`, which is higher than Astro's own 22.12.0 floor. The constraint
comes from `undici@8`, pulled in transitively via `astro -> unifont`; under `engine-strict` the
install genuinely fails on 22.14, so this is a real floor rather than caution.

Biome replaces ESLint, Prettier and Stylelint. Its `.astro` support is officially experimental and
2.4.x had a regression that appended runaway newlines on every fix pass, so it was verified here
before being relied on: repeated `biome check --write` runs against `.astro` files are idempotent
in 2.5.8. `html.experimentalFullSupportEnabled` therefore stays on. `public/` is excluded from
linting because a11y rules objecting that a favicon has no `<title>` are pure noise.

`esbuild` and `sharp` are allow-listed in `pnpm.onlyBuiltDependencies`. pnpm 10 blocks dependency
build scripts by default, and sharp is what generates the AVIF assets the performance budget
assumes.
