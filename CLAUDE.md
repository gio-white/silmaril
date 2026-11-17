# Silmaril — personal site

Giorgio's personal website and portfolio. A static Astro site with near-zero JavaScript, light and
dark themes, and a lazy-loaded three.js hero, hosted on Cloudflare Pages.

Work is tracked in [`docs/plan-of-action.md`](docs/plan-of-action.md): one phase at a time, one
branch and one pull request per phase. Giorgio reviews the preview and merges; never merge, and
never commit straight to `main`.

Two longer rule sets load automatically from `.claude/rules/`:

- `.claude/rules/architecture.md`: routes, the content model, where new code belongs.
- `.claude/rules/design-system.md`: tokens, type, motion tiers, accessibility floors, size budgets.

## Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Astro 7, static output | Every route prerenders to HTML. No SSR, no adapter. |
| UI islands | **None installed** | Nothing has needed runtime component state. Add with `pnpm astro add react` only when something genuinely does. |
| Language | TypeScript, `astro/tsconfigs/strict` | |
| Styling | Plain CSS + CSS Modules, tokens as custom properties | No Tailwind. No CSS-in-JS. |
| 3D | `three`, imported directly | No React Three Fiber. |
| Linter + formatter | Biome | Replaces ESLint, Prettier and Stylelint. |
| Package manager | pnpm (enforced) | |
| Runtime | Node `>=22.19.0` | See `.nvmrc`. |
| Host | Cloudflare Pages, free tier | Build `pnpm build`, output `dist`. |

## Commands

```bash
pnpm install          # never npm/yarn — preinstall guard will reject them
pnpm dev              # dev server (agents: `pnpm astro dev --background`, then `astro dev stop`)
pnpm build            # production build to dist/, then size-budget check
pnpm preview          # serve the built output
pnpm lint             # biome check (no writes)
pnpm format           # biome check --write
pnpm typecheck        # astro check
pnpm check            # biome + astro check — the gate below
pnpm check:budgets    # gzip/size budgets; requires dist/
pnpm rasterize        # SVG → AVIF/WebP posters and og.png
```

Astro docs: https://docs.astro.build. Read the relevant guide before routing, content collection,
styling or i18n work.

## Never do these

- **Never run `npm install` or `yarn`.** The `preinstall` guard rejects them, but do not try to
  work around it. A second lockfile is a real problem, not a formality.
- **Never add a dependency without a stated reason.** The size budget in the design-system rule is
  the constraint. If a library is the answer, say what CSS or a few lines of TypeScript could not
  do first.
- **Never add Tailwind or shadcn/ui.** Rejected deliberately; see `docs/decisions.md`.
- **Never reach for a UI framework component for something HTML already does.** The theme toggle
  is three radio inputs; as a React island it would have cost ~45 kB gzip to render them.
- **Never add `client:load`** unless the component must be interactive before paint. Prefer
  `client:visible` or `client:idle`, and prefer no directive at all.
- **Never use `outline: none`** without an equivalent `:focus-visible` replacement.

## Security

A static site has a small attack surface: no server, database or login. These rules apply to every
change, so that stays true.

- **Forms and user input.** If a form, query parameter or any user input is ever added, validate
  it on the server with a Zod schema, enforce length and type limits, reject unexpected fields, and
  escape all output. Client-side validation is a convenience, never the protection.
- **Spam and abuse.** Every form gets bot protection (Cloudflare Turnstile or a honeypot) and rate
  limiting.
- **No raw HTML from untrusted sources.** Never pass user or external content to `set:html` or
  anything like it.
- **Secrets.** Never commit keys, tokens or `.env` files. Use Cloudflare or GitHub secrets.
- **Headers stay strict.** Any new external origin (script, font, image, analytics) needs an
  explicit CSP change in `public/_headers`, explained in the `CHANGELOG.md` entry.
- **New dependencies and third-party scripts.** State the reason and flag them in the PR
  description before adding.
- **External links** use `rel="noopener noreferrer"`.
- **Least privilege.** Workflows and tokens get only the permissions they need; third-party
  GitHub Actions are pinned to a commit.
- **Personal data.** No phone number or home address anywhere on the site or in the CV PDF. Work
  case studies are anonymised where contracts or NDAs apply: no client names, ranges instead of
  exact figures, no internal screenshots.

## Definition of done

No task is finished until all four hold:

1. **`pnpm check` passes.** Biome and `astro check`, both clean.
2. **`pnpm build` succeeds.** This includes the size-budget check against `dist/`.
3. **`docs/` reflects reality.** If the architecture changed, `docs/architecture.md` and
   `.claude/rules/architecture.md` change in the same commit.
4. **`CHANGELOG.md` has an entry** describing what changed *and why*. The reason matters more than
   the list of files — the diff already shows the files.

## Commit style

One logical change per commit, conventional prefix (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`).
The body explains the reasoning, not the mechanics.

## Design skills

Installed in `.claude/skills/` for the design phases:

- **`frontend-design`** (Anthropic): aesthetic direction for new sections. Keep its output inside
  this site's design system; it does not override the tokens or the decision log.
- **`impeccable`** (Paul Bakaus, v4.9.2, skill only): `/impeccable audit`, `critique`, `polish`
  and the rest. Its design hook is deliberately not installed; see `CHANGELOG.md`.

Project commands in `.claude/commands/`: `/add-project` scaffolds a project entry, and
`/release-check` runs the full pre-merge checklist.
