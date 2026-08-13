# Changelog

What changed and, more importantly, why. The diff already shows which files moved; this records
the reasoning, so entries lead with the motivation rather than a file list.

Newest first.

---

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
