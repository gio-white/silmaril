# Personal site

A static personal website and CV for a data engineer. Astro, near-zero JavaScript, light and dark
themes, and a lazy-loaded three.js hero.

## Quick start

Requires Node `>=22.19.0` (see `.nvmrc`) and pnpm.

```bash
pnpm install
pnpm dev
```

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build to `dist/` |
| `pnpm preview` | Serve the built output |
| `pnpm lint` | Biome, no writes |
| `pnpm format` | Biome with `--write` |
| `pnpm check` | Biome + `astro check` — must pass before any change is done |
| `pnpm check:budgets` | Gzip/size budgets against `dist/` (also runs at the end of `pnpm build`) |

pnpm is enforced. `npm install` and `yarn` are rejected by a preinstall guard.

## Editing content

All content lives in `src/content/` as YAML and Markdown, validated by Zod at build time. There is
no database and no CMS — edit a file, push, and Cloudflare Pages rebuilds in about thirty seconds.

If you are filling the site in for the first time, [`docs/content-intake.md`](docs/content-intake.md)
is a template listing everything it needs.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) — how the site fits together
- [`docs/design-system.md`](docs/design-system.md) — palette, type, motion, and the reasoning
- [`docs/decisions.md`](docs/decisions.md) — why things are the way they are, and what was rejected
- [`docs/content-intake.md`](docs/content-intake.md) — content template
- [`CHANGELOG.md`](CHANGELOG.md) — what changed and why

Agent instructions live in [`CLAUDE.md`](CLAUDE.md), with longer rule sets in `.claude/rules/`.
The phased roadmap is [`docs/plan-of-action.md`](docs/plan-of-action.md).

## Deployment

Cloudflare Pages, free tier. Build command `pnpm build`, output directory `dist`. Repo-side config
is `wrangler.toml` plus `public/_headers`. No environment variables required. Point a custom domain
at the Pages project in the Cloudflare dashboard when you have one.
