# Changelog

What changed and, more importantly, why. The diff already shows which files moved; this records
the reasoning, so entries lead with the motivation rather than a file list.

Newest first.

---

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
