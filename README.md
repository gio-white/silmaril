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

Cloudflare Pages, free tier. Repo-side config is `wrangler.toml` plus `public/_headers`.

### How a change ships

1. Work happens on a branch, one pull request per change.
2. GitHub Actions (`.github/workflows/ci.yml`) runs `pnpm check`, `pnpm build` with the size
   budgets, an internal link check on `dist/`, and Lighthouse CI (thresholds in
   `lighthouserc.json`).
3. Cloudflare Pages builds the same branch and posts a preview URL on `*.pages.dev` to the PR.
   Previews are public.
4. Giorgio reviews the preview and merges. Pages deploys `main` to production in about a minute.

### One-time setup (Cloudflare and GitHub dashboards)

These cannot be done from the repository.

- **Cloudflare Pages project.** Workers & Pages → Create → Pages → Connect to Git → this repo.
  Production branch `main`, framework preset Astro, build command `pnpm build`, output directory
  `dist`. Under Settings → Variables, set `NODE_VERSION` to the value in `.nvmrc` (without the `v`)
  and `PNPM_VERSION` to the version in `package.json` `packageManager`. Preview deployments: all
  non-production branches.
- **Branch protection on `main`.** GitHub → Settings → Rules → Rulesets → New branch ruleset,
  target `main`: require a pull request, require the **Check and build** and **Lighthouse** status
  checks to pass, block force pushes, restrict deletions.
- **Web Analytics.** In the Pages project → Metrics → Web Analytics, enable it (automatic setup).
  Cloudflare then injects its cookieless beacon into every page at the edge; the CSP in
  `public/_headers` already allows `static.cloudflareinsights.com` and `cloudflareinsights.com`, and
  nothing else is needed in the repo.
- **Dependabot.** `.github/dependabot.yml` opens grouped update PRs every Monday. Under Settings →
  Code security, turn on Dependabot alerts, Dependabot security updates, secret scanning and push
  protection.

### Rolling back

Cloudflare keeps every deployment. In the Pages project → Deployments, open the last good
production deployment → ⋯ → **Rollback to this deployment**. The rollback is live in seconds; then
revert the bad commit on `main` with a pull request so the next deploy does not bring it back.
