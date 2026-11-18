# Architecture

A static personal website. Every route is prerendered to HTML at build time and served from a
CDN. There is no server, no database and no client-side router.

## Request lifecycle

There isn't one, which is the point. At build time Astro reads the content collections, validates
them against their schemas, renders each route to an HTML file, and emits hashed CSS and image
assets. Cloudflare Pages serves those files. The only JavaScript that reaches a browser is the
theme toggle, the scroll-spy, and — on desktop, on capable devices — the 3D hero.

```
src/content/*.yaml ──┐
                     ├─→ astro build ──→ dist/*.html + hashed assets ──→ Cloudflare Pages
src/sections/*.astro ┘
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Self-contained home. Condenses every section; this is the URL that gets shared. |
| `/projects` | Every project. |
| `/projects/<slug>` | Case study for one project. |
| `/experience` | Work history and education on one timeline. |
| `/skills` | Tech stack and certifications. |
| `/now` | What Giorgio is focused on, from `src/content/now/en.md`, with its `updated` date. |
| `/cv` | The CV as a page, built from the same collections. Its print stylesheet makes `public/cv.pdf` (`pnpm cv:pdf`). |
| `/404` | Not-found page. Cloudflare Pages serves `404.html` with a 404 status for any unknown path. |

Every route also exists in Italian under `/it/` (`/it/`, `/it/projects/<slug>`, `/it/experience`,
…). English stays at the root with no prefix, so the original URLs never change. Route files in
`src/pages/` and `src/pages/it/` are thin wrappers around the views in `src/views/`; components read
the language from `Astro.currentLocale`.

`#contact` is an anchor present on every page, never a route. `/writing/<slug>` is reserved for
later; nothing is built for it yet, but the shape is fixed so a future change does not need
redirects.

## The limit pattern

The home page and the dedicated pages render the *same* components. Each section takes an
optional `limit`:

```astro
<ProjectList limit={3} />   <!-- home: three cards -->
<ProjectList />             <!-- /projects: everything -->
```

A "see all" link renders only when the collection is longer than the limit. So while there are
three projects the site reads as a self-contained one-pager and no link appears; once there are
nine, the link appears on its own and the dedicated page starts earning its place.

The practical consequence is that **no decision is needed about which sections deserve their own
page** — the site changes shape as content accumulates.

## Content model

All content is files in `src/content/`, validated by Zod at build time.

| Collection | Holds |
| --- | --- |
| `profile` | Name, role, positioning, contact details, availability. |
| `roles` | Work history. |
| `education` | Degrees and study, sharing the Experience timeline with `roles`. |
| `projects` | Problem / approach / outcome, stack, links, optional long-form body. Optional `cover` (image + required alt, served as AVIF), `period`, `role`, `status` (live / archived / internal), `tags` (topics), `confidential` (hides links, adds an anonymised note) and `kind` (work / side, so a future `/lab` is a filter, not a new collection). |
| `skills` | Grouped technologies. |
| `certifications` | Issuer, name, dates, credential URL. |

A missing required field fails the build. That is the schema doing its job.

## Languages

English is the default; Italian is the second locale (Astro i18n routing, `prefixDefaultLocale:
false`).

- **Interface strings** live in `src/i18n/en.ts` and `src/i18n/it.ts`. The Italian dictionary is
  typed against the English one, so a missing key fails `astro check`.
- **Content** is split by locale folder: `src/content/<collection>/en/` and `…/it/`, matched by
  file name. An entry missing in Italian renders the English one with `lang="en"` and a short
  "not translated yet" note, rather than disappearing. Certifications live only in `en/`: their
  names are official titles.
- **The profile** (`src/data/profile.ts`) has shared contact details plus prose per locale.
- **Dates** are formatted with `Intl.DateTimeFormat` for the page's locale.
- **SEO:** `<html lang>`, `hreflang` alternates for every locale plus `x-default`, and
  `og:locale` with its alternate.
- **404:** Cloudflare Pages serves the nearest `404.html` up the path, so `pnpm build` moves the
  Italian one to `dist/it/404.html`.
- **Workflow:** write English first; Claude drafts Italian; Giorgio reviews.
  `pnpm check:translations` (a CI warning, never a failure) lists what is still untranslated.

## Directory layout

```
CLAUDE.md          agent instructions: stack, commands, security, definition of done
.claude/rules/     longer agent rule sets, loaded automatically
.claude/skills/    vendored design skills (frontend-design, impeccable)
.claude/commands/  project slash commands
docs/              this documentation
scripts/           build-time Node scripts, never shipped
public/            static assets served as-is; _headers lives here
src/
  pages/           routes only, thin; it/ holds the Italian twins
  views/           one component per page, shared by both languages
  i18n/            locales, URL helpers and the interface dictionaries
  layouts/         page shells: head, nav, footer, theme script
  sections/        one per content domain, limit-aware
  components/      shared pieces
  content/         collections and schemas
  three/           Scene3D loader + one folder per scene
  scripts/         the small amount of TypeScript shipped to browsers
  styles/          tokens.css, reset.css, type.css, motion.css
```

Component styles are colocated CSS Modules next to their component. Only the four global
stylesheets live in `src/styles/`.

## JavaScript policy

The site ships almost none, and there is **no UI framework installed**. Four things justify the
JavaScript that does ship:

1. **Theme toggle** — three native radio inputs plus ~440 bytes of module script. A ~230 byte
   blocking script in `<head>` applies the stored theme before first paint, so dark-mode
   visitors never see a white flash.
2. **Scroll-spy** — plain TypeScript, drives the axis gutter. Computed from bounding rects
   against a reading line, not from IntersectionObserver visibility, because several tall
   sections can be on screen at once.
3. **Reveal fallback** — a small IntersectionObserver, only when CSS scroll-driven animations
   are missing.
4. **The 3D hero** — dynamically imported, gated, never on the critical path.

Everything else is HTML and CSS.

## 3D scenes

`src/three/Scene3D.astro` owns capability gating, the lazy import, the poster fallback, and
pausing when hidden or backgrounded. Scenes are passed to it; they never load themselves. This
exists so that adding a second scene costs a scene file rather than a fresh round of performance
mistakes.

Gates a scene must pass before any WebGL code is fetched: viewport ≥48rem, `prefers-reduced-motion:
no-preference`, no `saveData`, `hardwareConcurrency >= 4`, and WebGL available. Failing any of
them leaves the static AVIF poster in place (WebP fallback), which is a raster of the same
displaced grid and looks deliberate.

Asset rules: glTF only, Draco or meshopt compressed, 300 kB maximum per asset.

## Deployment

Cloudflare Pages, free tier. Build command `pnpm build`, output directory `dist`. After `astro build`,
`pnpm build` runs two scripts against `dist/`: `csp-hashes.mjs` writes the SHA-256 hashes of the
built inline scripts into `dist/_headers` in place of the `'inline-script-hashes'` placeholder, and
`check-budgets.mjs` enforces the size budgets. Config lives in `wrangler.toml` and `public/_headers`.
No secrets are required to build. Custom domain is set in the Cloudflare dashboard
once the Pages project exists — it cannot be claimed from the repo.
