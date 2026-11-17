
# Architecture

Keep this file current. If you change the routing, the content model, or where a kind of file
belongs, update this rule and `docs/architecture.md` in the same commit.

## Shape of the site

A static multi-page site. **The home page is self-contained** — it condenses every section and
stands alone, because it is the URL that gets shared. Dedicated pages exist for depth.

```
/                     home: hero, about, projects, experience, skills, contact
/projects             all projects
/projects/<slug>      case study
/experience           work history and education
/skills               tech stack and certifications
404                   not-found page, served by Cloudflare Pages for unknown paths
#contact              anchor, present on every page — never a route
```

Reserved for later, do not invent a different scheme: `/writing/<slug>`.

## The limit pattern

Each content domain has **one** section component that takes an optional `limit`. The home page
passes a limit; the dedicated page does not. There is no separate "summary" component.

```astro
<ProjectList limit={3} />   <!-- home -->
<ProjectList />             <!-- /projects -->
```

The "see all" link renders only when the collection is longer than the limit, so the site reads
as a one-pager while content is thin and promotes itself as content grows. Never hardcode
whether a link is shown.

## Where things go

| Path | Contains |
| --- | --- |
| `src/pages/` | Routes only. Thin — compose layouts and sections, no logic. |
| `src/layouts/` | Page shells: `<head>`, nav, footer, theme script. |
| `src/sections/` | One per content domain, `limit`-aware. Numeric filename prefixes are ordering hints for humans and must never appear in rendered output. |
| `src/components/` | Reusable pieces used by more than one section. |
| `src/content/` | Content collections and their Zod schemas. The single source of truth for all CV data. |
| `src/three/` | `Scene3D` loader plus one folder per scene. |
| `src/styles/` | `tokens.css`, `reset.css`, `type.css`, `motion.css`. Component styles are colocated CSS Modules. |
| `src/scripts/` | The small amount of plain TypeScript shipped to the browser. |
| `scripts/` | Build-time Node scripts, never shipped. |

**`.astro` files stay thin.** Biome's `.astro` support is experimental, so real logic belongs in
`.ts`/`.tsx` where linting is reliable.

## Content lives in files, not a database

Content collections in `src/content/`, validated by Zod at build time, baked into static HTML.
Nothing is fetched at runtime. Editing content means editing a YAML or Markdown file.

Collections: `profile`, `roles`, `education`, `projects`, `skills`, `certifications`.

If a schema gains a required field, update the placeholder entries too — a build that fails on
missing content is the schema working correctly, not a bug to route around.

## 3D scenes

Every scene loads through `src/three/Scene3D.astro`, which owns capability gating, lazy import,
the poster fallback and pause-when-hidden. **Do not bypass it for a new scene.** The point is
that scene number two inherits the guardrails instead of relitigating them.

Hard rules for any 3D asset:

- glTF only, Draco or meshopt compressed, **300 kB per asset maximum**.
- Never on the critical path. Always behind a static AVIF poster (WebP fallback).
- Never loads under `prefers-reduced-motion: reduce`, or below the 48rem viewport gate.
- Authored posters are SVG in `src/assets/posters/`; `pnpm rasterize` emits the AVIF/WebP
  the page actually serves.
