# Decision log

Why the project is built the way it is. Each entry records the alternative that was rejected,
because that is the part that gets forgotten and re-litigated.

---

## Astro rather than plain Vite + React

**Decided:** Astro 7 with React islands.

The original brief said Vite + React + TypeScript with no framework added without a clear reason.
The requirement then grew to a personal site with several pages that would accumulate content
over time, which supplied the reason.

Astro is Vite underneath, so React and TypeScript are unchanged. What it adds: zero JS by default
with per-component opt-in, so the bundle budget is enforced by the tool rather than by
discipline; typed content collections; image optimization; and file-based routing.

**Rejected:** hand-rolling an SSG on Vite with a `prerender.ts` step. Roughly 200 lines of build
glue immediately, then reimplementing routing, content collections and an image pipeline by hand
as the site grew, with a chance to get performance wrong at each step.

---

## Static HTML, never client-side rendering

**Decided:** every route prerenders to HTML at build time.

This is the one architectural choice that is genuinely expensive to retrofit. Google executes
JavaScript on a deferred second pass, but LinkedIn, Slack, WhatsApp and Bing do not execute it at
all when building a link preview. Since the site is primarily reached through links the owner
sends, the preview card is a core feature, not a nicety.

---

## Content in files, not a database

**Decided:** content collections in `src/content/`, validated by Zod, baked into HTML.

The data changes a few times a year. A database would add a server, credentials, latency, a
monthly bill and something that can be down, in exchange for nothing. Files also give version
history in git, and the schema turns a missing field into a failed build rather than an empty
section on the live site.

**Not a one-way door:** a git-based CMS (Decap, Sveltia, Tina) can add a browser editing UI later
that commits to the repo, with no database and no architecture change.

---

## Self-contained home plus dedicated pages

**Decided:** the home page condenses everything and stands alone; `/projects`, `/experience` and
`/skills` hold the full lists; `/projects/<slug>` holds case studies.

A single long page converts better — someone deciding whether to make contact gives the site 30
to 60 seconds, and every click is a chance to lose them. But a growing project or certification
list clutters a one-pager, and a real case study does not fit in a card.

The resolution is the **limit pattern**: one component per domain, the home page passes a limit,
the dedicated page does not, and the "see all" link appears only when there is more content than
the limit. The site therefore behaves as a one-pager while thin and promotes itself as content
accumulates, with no future work and no decision required now.

Contact stays an anchor rather than a route: a contact page adds a click at the exact moment
someone has decided to reach out.

---

## No section numbers in the rendered output

**Decided:** plain section names. Numeric prefixes survive only in filenames as ordering hints.

Numbers were originally proposed as wayfinding on a long scroll and as the tick labels that make
the axis gutter read as a measurement axis. The gutter achieves the same thing with section
*names* as tick labels — a categorical axis is still an axis, and word labels double as
navigation.

The related pipeline-stage metaphor (`source`, `transform`, `sink`) was dropped outright. It made
a recruiter translate "transform" into "Experience" at the exact moment friction is most
expensive.

---

## Colour and typography diverge from the skill's recommendation

**Decided:** keep the blueprint-and-oxide palette; adopt Archivo; reject Space Grotesk and Inter.

The `ui-ux-pro-max` skill was run as its workflow requires. Findings:

- **Adopted — Archivo for display.** The skill independently recommended it, which is
  corroboration of an independent choice.
- **Adopted — the Swiss Modernism 2.0 structural system:** strict grid, mathematical spacing, a
  single accent only, high contrast, no decoration. This is essentially the planned direction and
  its constraints are now written into `design-system.mdc`.
- **Adopted — its Astro and UX guidance**, which is sound: islands, minimal client directives,
  `<Image>`/`<Picture>`, preload critical fonts, respect reduced motion, one or two animated
  elements per view.
- **Rejected — the colour palette.** Across two runs it returned `#18181B`, `#3F3F46`, `#2563EB`,
  `#EC4899`, `#FAFAFA`, `#DC2626` — verbatim Tailwind defaults (zinc-900, zinc-700, blue-600,
  pink-500, neutral-50, red-600). The explicit brief is to avoid a templated look, and the
  skill's own anti-pattern list says "generic layouts". Our palette satisfies the same
  single-accent, high-contrast, minimal-colour rule with values that are not shared with every
  other site built this year.
- **Rejected — Space Grotesk and Inter for body.** The two runs disagreed with each other, and
  both are the over-used defaults the brief rules out. Public Sans is used instead: built for
  legibility at small sizes, neutral without being Inter.
- **Rejected — the GSAP motion snippets.** We get staggered reveals from CSS scroll-driven
  animations at zero bytes. The suggested `back.out(1.4)` overshoot is also flagged by the skill
  itself as wrong for informational UI, which a CV largely is.
- **Not applicable — its "Common Rules" and pre-delivery checklist**, which are explicitly scoped
  to mobile app UI (safe areas, haptics, Dynamic Type). The three.js ruleset assumes a
  CDN-loaded r128 build; we bundle a current version through npm, so pinning to a 2021 release
  would be a downgrade.

---

## React removed — no UI framework at all

**Decided:** no framework integration. `pnpm astro add react` restores it in one command if
something genuinely needs runtime component state.

The plan called for React islands, with the theme toggle as the first one. Building it revealed
that was the wrong call twice over.

First, the toggle does not need a framework. It is three mutually exclusive options, which is
exactly what native radio inputs are for — and they bring correct roles, arrow-key navigation and
screen-reader announcements with no code, while remaining meaningful before any script runs. As a
React island it would have cost roughly 45 kB gzip to render three radios, against a 6 kB
critical-path budget for the entire site.

Second, with no island using it, registering `@astrojs/react` still emitted a 191 kB React chunk
into `dist/`. Nothing referenced it, so it never reached the critical path, but it was dead weight
being deployed on every build.

Measured result after removal: **668 bytes of gzipped JavaScript, both scripts inlined, zero JS
files emitted.**

The general lesson, now written into `stack.mdc`: on a content site, check whether semantic HTML
plus a few lines of TypeScript is enough before reaching for a component.

---

## Node everywhere, no Bun

**Decided:** Node `>=22.19.0`.

Bun as a runtime was requested and then withdrawn. Astro does not officially support it; the
documented failure modes include the MDX integration, dev-server segfaults, and `sharp`'s native
bindings — and `sharp` is exactly what generates the AVIF assets the performance budget depends
on.

The Node floor is 22.19.0 rather than Astro's own 22.12.0, because `undici@8` arrives
transitively through `astro -> unifont` and requires it. With `engine-strict=true`, 22.12 fails
to install.

---

## Biome instead of ESLint + Prettier + Stylelint

**Decided:** Biome as the single linter and formatter, with experimental `.astro` support on.

Its `.astro` support is officially experimental and 2.4.x had a regression that appended runaway
newlines on each fix pass. Verified on this repo with 2.5.8: formatting is idempotent across
repeated runs, so the feature stays enabled. `.astro` files are kept thin regardless, with real
logic in `.ts`/`.tsx` where Biome's support is solid.

`public/` is excluded from linting — a11y rules complaining that a favicon lacks a `<title>` are
noise.

---

## No Motion, no shadcn/ui

**Decided:** neither, with documented triggers to revisit.

**Motion** is not needed because reveals, hover states, the gutter fill and page transitions are
all CSS at zero bytes. The costs if it were added: `motion/react` is ~34 kB gzip and cannot be
tree-shaken smaller; `LazyMotion` plus `m` is ~4.6 kB initial plus ~15–17 kB for `domAnimation`.
In Astro it would also require a hydrated React island, so the real bill is React plus Motion.
The vanilla `animate()` at ~2.3 kB is the form to use if it ever becomes necessary.

*Trigger:* a filterable or re-ordering grid (FLIP/layout animation is the one thing CSS cannot
do), drag gestures, or spring physics.

**shadcn/ui** was rejected for three reasons. It hard-requires Tailwind, so adopting it means
abandoning CSS Modules or running two styling systems for the sake of a few components. Every
component is React plus Radix, so in Astro each becomes a hydrated island — a `Button` costing
~45 kB of React to render a `<button>` inverts the reason for choosing Astro. And its default
appearance is currently the most recognizable generated-portfolio aesthetic on the web, which is
precisely what the brief rules out.

*Trigger:* a command palette, filterable index, multi-step form or data table. At that point use
**Radix primitives directly** — unstyled, no Tailwind requirement — so CSS Modules survive.

---

## Discoverability scoped to link sharing

**Decided:** ship per-page titles, descriptions, Open Graph and Twitter tags, and a designed
`og:image`. Defer `sitemap.xml`, `robots.txt` and JSON-LD.

The site is reached through links the owner sends, so the preview card and load speed are the
parts that pay. The deferred items are purely additive and cost nothing to retrofit. URL shapes
are fixed now because renaming routes later costs redirects.

The share card is a **PNG**, not SVG. Slack, LinkedIn and WhatsApp routinely ignore SVG unfurls,
so `public/og.png` (1200×630) is a raster of the same axis-and-type composition. `twitter:image`
points at the same file.

---

## Script CSP by hash, computed after the build

**Decided:** `script-src` allows `'self'` plus the SHA-256 hash of each inline script, written into
`dist/_headers` by `scripts/csp-hashes.mjs` after `astro build`. `'unsafe-inline'` is gone from
`script-src`.

The inline scripts are the no-flash theme script and three small modules Astro inlines because
they are under its size threshold. They are the same on every page, so one header covers the site.
Hashing the built output rather than the source means the allow-list cannot drift: change a script
and the next build allows only the new hash.

**Rejected:** Astro's built-in `security.csp`. It emits a `<meta>` policy per page, but the
`_headers` policy still applies on top, and the two are intersected: the header would have to allow
the scripts anyway, so the meta tag adds nothing. A meta policy also cannot carry `frame-ancestors`.

**Not yet:** `style-src` keeps `'unsafe-inline'`. Astro inlines small stylesheets, and an injected
stylesheet is a much weaker attack than an injected script. Revisit if the site ever renders
third-party content.

---

## Two languages: locale folders, shared views, English fallback

**Decided:** Astro i18n routing with English at the root and Italian under `/it/`. Content is split
into `en/` and `it/` folders per collection, matched by file name; pages are shared views rendered
by thin route files in each language.

Folders rather than a `locale` field because a translation is then a file next to its original,
and "what is untranslated" is a directory listing (`pnpm check:translations`). Shared views rather
than a dynamic `[locale]` segment because English must stay prefix-free, and two thin route files
per page are easier to read than one `getStaticPaths` that special-cases the default.

An untranslated entry falls back to English, marked with `lang="en"` and a one-line note, instead
of disappearing: a half-translated Italian CV with gaps would be worse than one with a few English
paragraphs.

**Rejected:** a translation library (i18next and similar). Two typed dictionary objects give
compile-time checks for missing keys with no runtime JavaScript.

