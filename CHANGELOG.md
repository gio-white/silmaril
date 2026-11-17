# Changelog

What changed and, more importantly, why. The diff already shows which files moved; this records
the reasoning, so entries lead with the motivation rather than a file list.

Newest first.

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
