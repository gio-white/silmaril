# Design system

The enforceable version of this lives in [`.cursor/rules/design-system.mdc`](../.cursor/rules/design-system.mdc)
and the values live in `src/styles/tokens.css`. The `ui-ux-pro-max` skill's generated
recommendation is in [`design-system/personal-site/MASTER.md`](../design-system/personal-site/MASTER.md);
what we actually ship, where the two disagree, is in
[`design-system/personal-site/OVERRIDES.md`](../design-system/personal-site/OVERRIDES.md).
This document explains the reasoning.

## The idea

**Instrument on drafting paper.** A cool neutral ground, hairline rules, mono numerals, and one
hot accent used the way a monitoring dashboard uses red — reserved for thresholds and emphasis.

The register is a technical drawing or a plotting library, not a terminal. That matters because
the two obvious defaults for a developer portfolio are cream-and-serif or dark-with-a-neon-accent,
and both are immediately recognizable as generated. Light is the canonical theme here partly
because it reads faster and prints well, and partly because most developer portfolios are dark,
which makes light the contrarian choice.

Structurally this is Swiss Modernism: strict grid, mathematical spacing, one accent, high
contrast, no decoration.

## Colour

Two designed palettes, not one palette inverted. Every ratio below was computed against that
theme's background and passes WCAG AA for body text.

**Light** — `--paper` `#EDF0F2`, a pale cool blue-grey that reads as drafting paper rather than
cream. `--ink` `#101418` at 16.2:1. `--slate` `#4F5963` at 6.24:1 for secondary text and
hairlines — darker than a theoretical-AA `#5B6670` because 12px antialiased labels sampled
below 4.5:1 in Lighthouse. `--rust` `#B23A16` at 5.23:1. `--teal` `#0E6B63` at 5.56:1.
`--surface` `#FFFFFF`.

**Dark** — `--paper` `#101519`, a deep desaturated blue-black. `--ink` `#E6EAED` at 15.2:1.
`--slate` `#96A1AB` at 6.98:1. `--rust` `#D9603A` at 4.97:1, deliberately muted rather than
glowing. `--teal` `#4FB3A6` at 7.29:1. `--surface` `#181D22`.

`--rust-bright` `#E4572E` exists for the WebGL canvas only, where text contrast rules do not
apply. It must never be used for text.

**Why rust and teal.** Oxide rust is the colour of red-pen annotation and of the threshold line
in every monitoring tool. Teal is the conventional "healthy throughput" hue. Both carry meaning
for someone who works with data, rather than being decoration.

**One accent at a time.** Rust carries emphasis; teal marks positive states. A third colour means
the layout is failing to create hierarchy on its own.

## Typography

**Archivo** for display, a variable grotesque with a width axis (62–125) as well as weight
(100–900). Headings sit at expanded widths, 112–125. The width axis is the whole reason for the
choice — expanded Archivo reads like equipment labelling or a chart axis title, and it is neither
Inter nor Space Grotesk, which is most of the battle.

**Public Sans** for body. Designed for a government service, so it is engineered for legibility
at small sizes and long-form scanning — which is what a CV bullet is — and neutral enough not to
compete with the display face.

**IBM Plex Mono**, one weight, strictly rationed to dates, metrics, tags and axis labels. It makes
numbers read as measurements and keeps them aligned in the timeline. It is not for prose.

All three are self-hosted WOFF2, latin subset, `font-display: swap`. No third-party font CDN: a
request to Google Fonts is a wasted round trip and a privacy footnote.

## The signature element: the axis gutter

A hairline running down the left edge of the page with tick marks and small mono labels — a
chart's Y-axis that the content is plotted against. The current section's tick fills with rust as
you scroll.

It does three jobs at once, which is why it earns the space: scroll progress on a long page,
navigation, and the visual signature someone describes when they remember the site. It costs one
CSS scroll-driven animation.

On the home page the ticks are sections. On a dedicated page there is no multi-section scroll to
track, so it becomes a site-level axis whose ticks are the pages, keeping the identity coherent
across the site. Below 64rem the labelled axis has no horizontal room, so it becomes a 2px
scroll-progress rail on the inline-start edge — same rust fill, no labels. The sticky header
carries named navigation at that size.

## Motion

Nearly all of it is free. CSS scroll-driven animations handle reveals and the gutter fill on the
compositor thread, so they cannot stutter the main thread, and they sit inside `@supports` with
the visible state as the default — Firefox, which has not shipped the feature, sees a complete
static page rather than a broken one. Cross-document view transitions are two lines of CSS.

The discipline that matters more than the technique: **one or two animated elements per view**.
Everything stops under `prefers-reduced-motion: reduce`.

## Responsive

Mobile-first CSS, desktop-first ambition. Authoring uses `min-width` queries, which produces less
CSS and fewer overrides. But the design is conceived at desktop size, because that is where the
site is most likely to be evaluated, and then reduced deliberately — the mobile layout is a
complete design at that size, not a desktop layout with pieces switched off.

Most scaling is fluid via `clamp()`, so sizing is continuous rather than stepping at breakpoints.
The three breakpoints (48rem, 64rem, 90rem) exist for genuine layout changes only.

Navigation has no hamburger. For four destinations, hiding the nav costs a tap and buys nothing,
so mobile gets a wrapped row of small text links.

The 3D hero does not load below 48rem. On a mid-range phone the scene is too small for its detail
to register while costing the most in battery, GPU and bandwidth — bad in every direction. The
static poster is a real rendered frame, so the hero still looks intentional.

## Relationship to the ui-ux-pro-max skill

The skill was run as its workflow requires. Its structural system (Swiss Modernism) and its Astro
and UX guidance were adopted and are reflected in the rules. Its colour palette and body typeface
were rejected as verbatim Tailwind defaults and over-used faces respectively.
[`decisions.md`](decisions.md) records exactly what was taken, what was not, and why.
