# Silmaril — Plan of action for Claude Code

Repo: github.com/gio-white/silmaril (`main` @ `2a37223`). Goal: turn the existing, well-engineered template into Giorgio's personal website and portfolio — a spotlight that can grow over time.

This plan tracks every suggested change so it can be tackled **one phase at a time in Claude Code**. Phase 0 results: [`audit-2026.md`](audit-2026.md).

## How to use this plan

- **One branch and one pull request per phase** (large phases can be split into several PRs). Never commit straight to `main`.
- **Definition of done for every PR:** `pnpm check` passes, `pnpm build` passes (includes size budgets), `docs/` updated if structure changed, a `CHANGELOG.md` entry explaining *why*.
- Tick the boxes as you go. Items marked **[DECISION]** need Giorgio's input before Claude Code starts them; everything else Claude Code can implement on its own judgment.
- Start each Claude Code session with: *"Read CLAUDE.md and docs/plan-of-action.md, then work on Phase N."*

## Decisions already made

- **Tooling:** Claude Code only. Cursor is no longer used; all Cursor files are removed or migrated.
- **Languages:** English first (default, at the root URL), Italian second.
- **Hosting:** Cloudflare Pages free plan. Target running cost: only the domain (roughly $10–20 a year; check current prices).
- **Social proof:** no testimonials or LinkedIn recommendations for now.
- **Dynamic features:** none for now (no AI chat, no forms, no counters). The site stays fully static; interactivity is client-side only.
- **Trust level:** Claude Code decides the straightforward technical items (404, SEO, CI, headers). Giorgio is asked only on real decisions.

## Open decisions for Giorgio

- [ ] **[DECISION] Domain name** and extension (.com, .dev, .it…). Buy through Cloudflare Registrar.
- [x] **[DECISION] Positioning line** — decided: "Data & AI Engineer".
- [ ] **[DECISION] CV** — upload one version (any language) as the source for all content.
- [ ] **[DECISION] Which projects are public**, and at what level of detail (full, anonymised, or title only).
- [x] **[DECISION] Preview links** — decided: public.
- [x] **[DECISION] Merging** — decided: Giorgio always merges.
- [x] **[DECISION] Headshot** — decided: no.
- [x] **[DECISION] Extra routes** — decided: /cv and /now now; /lab, /writing and /uses later.

## Phase 0 — Baseline and functional audit, then fix

Nothing has been run yet: the original review only read the source. This phase proves what actually works.

### 0.1 Baseline

- [x] `pnpm install` (Node ≥ 22.19, pnpm 10).
- [x] `pnpm check` and `pnpm build`; record any errors and budget failures.
- [x] `pnpm preview` and test in a real browser (desktop and mobile viewport; light and dark).

### 0.2 Page-by-page functional check

- [x] **Home /:** hero renders; 3D scene loads on desktop and the poster shows on mobile / reduced motion; "Get in touch" and "Download CV" work; each section renders; "see all" links appear only when content exceeds the limit; the axis gutter tracks the section in view.
- [x] **/projects:** every project card renders; links work; projects with a body link to their detail page and those without do not.
- [x] **/projects/<slug>:** case-study Markdown renders (headings, tables, lists); back navigation; title, description and OG tags correct.
- [x] **/experience:** roles and education in the right order; "Present" for current roles; dates formatted.
- [x] **/skills:** skill groups and certifications render; expired certifications handled sensibly.
- [x] **Global:** nav active state on every page and on `/projects/<slug>`; `#contact` anchor resolves from every page; footer links; theme toggle (light / dark / system) persists across pages with no flash on load; keyboard navigation and visible focus; no console errors; no broken internal links.
- [x] **Unknown URL:** confirm the current behaviour (no 404 page exists yet).
- [x] **Head and meta:** canonical and OG URLs (currently wrong because `site` is `example.com`), `og.png`, favicon.
- [x] **Accessibility and performance:** run Lighthouse on home and one detail page; note anything below 90.

### 0.3 Report and fix

- [x] Write `docs/audit-2026.md` listing every bug, grouped by severity (broken / wrong / cosmetic), with the page and the steps to reproduce.
- [x] Fix every bug that is not about placeholder content (content is fixed in Phase 4). One commit per fix.
- [x] Re-run the checklist; record the result in the audit file.

## Phase 1 — Move from Cursor to Claude Code, housekeeping

- [x] **Remove .cursor/skills/** (146 files, 2.9 MB of unrelated third-party design skills). Remove the matching `__pycache__` lines from `.gitignore`.
- [x] **Migrate .cursor/rules/** (`stack.mdc`, `architecture.mdc`, `design-system.mdc`) into Claude Code: a root `CLAUDE.md` holding the essentials (stack, commands, never-do list, definition of done, commit style), with the longer rule sets moved to `.claude/rules/` or `docs/` and imported with `@path` references. Then delete `.cursor/`.
- [x] **Replace AGENTS.md** (Astro's stock boilerplate): either delete it or reduce it to a pointer to `CLAUDE.md`.
- [x] **Update every reference** to `.cursor/rules` in `README.md`, `docs/architecture.md` and `CHANGELOG.md` guidance.
- [x] **Add the security guideline** from Phase 3 to `CLAUDE.md` as a standing rule.
- [x] **Add the plan** to the repo as `docs/plan-of-action.md`.
- [x] **Add src/pages/404.astro** in the site's design: short message, link home, contact anchor. Check that Cloudflare Pages serves it for unknown routes.
- [x] **Install design skills** for later phases: Anthropic's `frontend-design` skill and Paul Bakaus's **Impeccable** (commands such as `/impeccable audit`, `critique`, `polish`). Install per each project's README; record them in `CLAUDE.md`.
- [x] Optional: project slash commands in `.claude/commands/`, e.g. `/add-project` (scaffold a project entry from the intake template) and `/release-check` (run check, build and the Phase 0 checklist).

## Phase 2 — CI/CD

Target flow: Claude Code works on a branch → opens a PR → CI runs → Cloudflare posts a preview URL → Giorgio reviews → merge → live in about a minute.

- [x] **GitHub Actions workflow** `.github/workflows/ci.yml` on every PR and push to `main`: set up Node from `.nvmrc`, pnpm via `packageManager`, `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`. Cache the pnpm store.
- [x] Workflow `permissions: contents: read` (least privilege); pin third-party actions to a version or commit.
- [x] Optional CI jobs: broken-link check on `dist/`, an accessibility scan, Lighthouse CI with thresholds. (Link check and Lighthouse CI; Lighthouse's accessibility category is the scan, failing below 95.)
- [ ] **Cloudflare Pages project** (manual, Giorgio; steps in `README.md`) connected to the GitHub repo: production branch `main`, build command `pnpm build`, output `dist`, Node version set to match `.nvmrc`. Every PR gets a preview URL on `*.pages.dev`.
- [ ] **Branch protection on main** (manual, Giorgio; steps in `README.md`): PR required, CI must pass, no force pushes.
- [x] **Dependabot** (or Renovate): weekly, grouped dependency PRs plus security alerts; CI validates them.
- [x] **Rollback procedure** documented in `README.md`: roll back from the Cloudflare Pages deployments list.
- [x] Apply the **[DECISION]** on preview protection and on who merges. (Public previews; Giorgio merges.)

## Phase 3 — Security

A static site has a small attack surface: no server, database or login. The real risks are the accounts around it, the dependencies, and what the content reveals.

### 3.1 Standing security guideline (goes into CLAUDE.md in Phase 1, applies to every future change)

1. **Forms and user input:** if any form, query parameter or user input is ever added, validate it on the server with a schema (Zod), enforce length and type limits, reject unexpected fields, and escape all output. Client-side validation is a convenience, never the protection.
2. **Spam and abuse:** every form gets bot protection (e.g. Cloudflare Turnstile or a honeypot) and rate limiting.
3. **No raw HTML from untrusted sources:** never pass user or external content to `set:html` or similar.
4. **Secrets:** never commit keys, tokens or `.env` files. Use Cloudflare or GitHub secrets. Keep GitHub secret scanning and push protection on.
5. **Headers stay strict:** any new external origin (script, font, image, analytics) needs an explicit CSP change, explained in the `CHANGELOG.md` entry.
6. **New dependencies and third-party scripts:** state the reason and flag them in the PR description before adding.
7. **External links** use `rel="noopener noreferrer"`.
8. **Least privilege:** workflows and tokens get only the permissions they need.

### 3.2 Accounts (manual, Giorgio)

- [ ] (Manual, Giorgio) Two-factor authentication on GitHub, Cloudflare and the domain registrar; store recovery codes safely.
- [ ] (Manual, Giorgio) Registrar transfer lock enabled on the domain.

### 3.3 Headers

- [ ] Add `Strict-Transport-Security` once the custom domain is live (start with a short `max-age`, raise it after a week).
- [x] Remove `'unsafe-inline'` from `script-src`: switch to hash-based CSP so the inline theme script is allowed by hash. (Done with a post-build hashing step rather than Astro's meta-tag CSP; see `docs/decisions.md`.)
- [x] Re-test the theme toggle, scroll-spy and 3D hero with the tightened CSP; check the browser console for violations.

### 3.4 Supply chain

- [x] Dependabot security alerts on (toggle is manual, see `README.md`); keep `pnpm.onlyBuiltDependencies` restricted to what is needed.
- [x] CI uses `--frozen-lockfile`; third-party actions pinned (Phase 2).

### 3.5 Personal and confidential data

- [x] Public CV PDF has no phone number or home address; strip PDF metadata. (Generated from `/cv`: no phone or address; the only metadata is the page title and Chromium as producer.)
- [ ] Consider an email alias for the site to contain spam.
- [ ] Review every work case study against contracts or NDAs (e.g. CNH or client projects): anonymise names, use ranges instead of exact figures, no internal screenshots.
- [x] Apply the **[DECISION]** on preview link protection. (Public.)

## Phase 4 — Identity and content

The biggest single improvement: today every piece of content is placeholder for a fictional "Alessandro Bernardini".

### 4.1 Content source

- [x] **[DECISION]** Giorgio uploads his CV (any language version; the copy is the same). (Taken from the "CV Giorgio Bianchini" design artifact.)
- [x] Claude Code extracts it into `docs/content-source.md` (roles, dates, education, projects, skills, certifications, links), then maps it onto `docs/content-intake.md`.
- [x] Giorgio reviews the extraction before it goes into `src/content/`. (Review in the Phase 4 PR; open items listed in `docs/content-source.md`.)

### 4.2 Positioning and model

- [x] **[DECISION]** One-line positioning (proposal: "Data & AI" rather than pure "Data Engineer"). Decided: "Data & AI Engineer" plus the platforms-and-agents line.
- [x] Widen what is hard-wired to data engineering: hero role, metric labels (e.g. "Years in data engineering"), schema comments, intake template.
- [x] Rework skill groups to match the real profile, for example: Languages · Data platforms (Databricks, Delta) · BI & analytics (Power BI) · AI & agents (Microsoft Foundry, LLMs) · Cloud · Engineering practice · Currently learning.

### 4.3 Replace all placeholder content

- [x] `src/data/profile.ts`: name, role, positioning, about, metrics, location, availability, email, GitHub, LinkedIn.
- [x] `src/content/roles`, `education`, `projects`, `certifications`, `skills`: real entries; remove every `PLACEHOLDER` comment. (Projects are three marked samples by decision until real public ones exist.)
- [x] Expired certifications: hide, or show as "expired" (decide during implementation). Shown as "Expired"; no expiry dates are in the CV yet.
- [x] **Guard in CI:** fail the build if `example.com` or `PLACEHOLDER` remains anywhere in `src/` or `public/`. (`pnpm check:launch`; warn-only in CI while sample projects exist, strict at go-live.)

### 4.4 Content quality rules

- [x] Every role highlight carries a number (volume, time saved, cost, users, people). (Where the CV has one; stronger numbers are an open item.)
- [x] Projects follow problem → approach → outcome, with the outcome measured.
- [x] Confidential work is anonymised ("a global manufacturer"), with ranges instead of exact figures.
- [x] A more personal About: what you care about and a line on life outside work, not a generic senior-engineer voice. (Personal line left out for now, by decision.)
- [x] No testimonials (decided).

### 4.5 Assets

- [x] Real `public/cv.pdf` (no phone or address; see Phase 3). Later replaced by the generated CV in Phase 10. (Generated from `/cv`.)
- [x] Regenerate `og.png` with the real name and positioning (`pnpm rasterize`).
- [x] Favicon with a real monogram.
- [x] **[DECISION]** Headshot: if yes, add it to About via `astro:assets`. Decided: no.

## Phase 5 — Portfolio depth

**5.1 Extend the project schema** (`src/content.config.ts`)

- [x] `cover` image via `astro:assets`, with required `alt`.
- [x] `period` (year or date range), `role` (solo / team of N), `status` (live / archived / internal), `tags`.
- [x] `confidential: boolean`: hides repo links and shows a short "details anonymised" note.
- [x] `kind: 'work' | 'side'`: one collection for both, so side projects (Phase 10, /lab) need no second model.
- [x] Update cards and detail pages to show the new fields; update `docs/architecture.md`.

### 5.2 Visuals

- [x] Cover images on cards; screenshots and diagrams inside case-study bodies (optimised by Astro, within the size budgets).
- [ ] Optional per-project OG image. (Deferred: the site-wide card is used until real projects exist.)

### 5.3 Two or three real case studies

- [x] **[DECISION]** Pick which. Candidates: the Parts Sales Power BI report redesign, the Microsoft Foundry agent that generates SQL on Databricks, and a side project such as Atlas. (Decided: no client case studies; public side projects only, samples until they exist.)
- [x] Each one covers: the constraint that shaped the design, what was tried and dropped, the measured result. (The sample case study shows the format: constraint, what was tried and dropped, measured result.)

## Phase 6 — Multi-language (English first, Italian second)

Must be done before go-live, because it fixes the URL shapes, and changing URLs after launch costs redirects.

- [ ] **Routing:** Astro i18n routing with English as the default at the root (`/projects`) and Italian under `/it/` (`/it/projects`). No prefix for the default language.
- [ ] **Interface strings** (nav, buttons, section titles, labels, 404) in typed dictionaries, e.g. `src/i18n/en.ts` and `src/i18n/it.ts`, so a missing key fails `astro check`.
- [ ] **Content:** per-locale entries (e.g. `src/content/projects/en/` and `/it/`, or a `locale` field). An Italian page that is not translated yet falls back to English with a short notice.
- [ ] **Language switcher** in the header that links to the same page in the other language, not to the home page.
- [ ] **SEO for languages:** `<html lang>`, `hreflang` alternates plus `x-default`, `og:locale`, and both languages in the sitemap (Phase 8).
- [ ] **Dates** formatted per locale with `Intl.DateTimeFormat` (today `formatMonth` hard-codes English month names).
- [ ] **CV** in both languages (Phase 4 now, generated in Phase 10).
- [ ] **Translation workflow:** write English first; Claude Code drafts Italian; Giorgio reviews. A CI step lists untranslated pages as a warning, not a failure.
- [ ] Update `docs/architecture.md` (routes table) and `CLAUDE.md`.

## Phase 7 — Design refinement

The current design is already distinctive (Swiss grid, blueprint-and-oxide palette, Archivo, 3D signal surface). Refine it on real content rather than restart.

- [ ] Run `/impeccable audit` and `/impeccable critique` on home, one project page, `/experience` and mobile; record findings in `docs/design-review.md`.
- [ ] Apply fixes selectively with `/impeccable polish`; use the `frontend-design` skill for new sections so they stay consistent with the design system.
- [ ] Specific checks: hero with the real name and positioning length; 3D scene still fits; project cards with covers; dark mode; language switcher placement; 404 page.
- [ ] Optional: View Transitions between pages, within the size budgets.
- [ ] Existing design rules stay unless deliberately changed (single accent, tokens, no Tailwind or shadcn, see `docs/decisions.md`); any change gets a decision-log entry.

## Phase 8 — Discoverability and analytics

- [ ] `sitemap.xml` (Astro sitemap integration) including both languages.
- [ ] `robots.txt` allowing all crawlers and pointing to the sitemap.
- [ ] JSON-LD `Person` on the home page: name, job title, site URL, and `sameAs` links to LinkedIn and GitHub.
- [ ] Unique title and description on every page, in both languages.
- [ ] Cloudflare Web Analytics (free, cookieless); update the CSP in `public/_headers` for it.
- [ ] Update `docs/decisions.md`: the deferred discoverability items are now done.

## Phase 9 — Go-live

- [ ] **[DECISION]** Domain bought through Cloudflare Registrar and attached to the Pages project; one canonical host (redirect `www` to the bare domain, or the reverse).
- [ ] Set `site` in `astro.config.mjs` to the real domain; rebuild.
- [ ] Turn on HSTS (Phase 3.3).
- [ ] **Pre-launch checklist:** no placeholders left (CI guard green); Phase 0 checklist passes on production; 404 works; both languages; CV downloads; no broken links; security headers verified (e.g. securityheaders.com); Lighthouse at 90+.
- [ ] Check link previews on LinkedIn (Post Inspector), WhatsApp and Slack.
- [ ] Verify the site in Google Search Console and submit the sitemap.

## Phase 10 — Growth (after launch, pick per [DECISION])

- [ ] **/lab — side projects:** personal builds and experiments (e.g. Atlas), using `kind: 'side'` from Phase 5. Lighter cards than case studies: what it is, why, status, link or demo.
- [x] **/now:** one Markdown page with a "last updated" date: what you are focused on this month.
- [ ] **/writing:** short notes and posts (route already reserved): a `posts` collection, tags, RSS feed, per-post OG image.
- [ ] **/uses:** your tools and setup.
- [x] **/cv:** a print-styled CV generated from the same content, exported to PDF at build time in each language, replacing the hand-made `cv.pdf` so the CV and the site never drift apart. (PDF via `pnpm cv:pdf`, run locally and committed: Cloudflare's build has no browser. Italian version with Phase 6.)
- [x] **Navigation:** today four items fit on a phone without a menu. New routes need a nav decision (e.g. secondary links in the footer, or a "More" group). (Decided: /now and /cv go in the footer; the header keeps four items plus Contact.)

## Backlog — not now

- Social proof (testimonials, LinkedIn recommendations): skipped by decision.
- Dynamic features: contact form, visit counter, an "ask my CV" AI chat (Cloudflare Pages Functions, plus the AI model's API cost). If ever built, the Phase 3.1 guideline applies in full.
- Git-based CMS (Sveltia or Decap) to edit content from a phone.
- Tag filter on `/projects` once there are more than about 8 projects.
- TypeScript 7 upgrade once `astro check` supports it.

## Order and gates

1. **Start now, no input needed:** Phase 0 (audit and fixes), Phase 1 (Claude Code setup), Phase 2 (CI/CD on a `pages.dev` URL), Phase 3 (security, except HSTS).
2. **Needs the CV and positioning:** Phase 4, then Phase 5.
3. **Before launch:** Phase 6 (languages), Phase 7 (design), Phase 8 (SEO and analytics).
4. **Needs the domain:** Phase 9 (go-live).
5. **After launch:** Phase 10, one route at a time.

