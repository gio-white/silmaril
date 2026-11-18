# Go-live runbook

Phase 9 of [`plan-of-action.md`](plan-of-action.md). Everything here waits for the domain; once it
is bought, this is about fifteen minutes of work plus DNS propagation. Steps marked **(Claude)**
are a pull request; the rest are dashboard clicks.

## Before the domain

- [ ] Real public projects replace the three samples in `src/content/projects/en/` and `it/`
      (or the samples are deleted and the Projects section waits).
- [ ] The open items in `docs/content-source.md` are answered or consciously skipped.
- [ ] The Italian drafts are reviewed.

## 1. Buy and attach the domain

1. Cloudflare dashboard → Domain Registration → Register Domains → buy the domain (at-cost price,
   WHOIS privacy included). Turn on **transfer lock** and **auto-renew**.
2. Workers & Pages → the Pages project → Custom domains → **Set up a custom domain** → the bare
   domain (`example.com`). Add `www.example.com` as well.
3. Rules → Redirect Rules → **Redirect from WWW to root** template (301, preserve path and query
   string), so there is one canonical host.

## 2. Point the site at it **(Claude)**

1. `astro.config.mjs`: `site: 'https://<domain>'`. This fixes canonical URLs, `hreflang`, Open
   Graph, the sitemap and `robots.txt` in one place.
2. `public/_headers`: add under `/*`:
   `Strict-Transport-Security: max-age=86400`
   (one day to start; raise to `max-age=31536000; includeSubDomains` after a week without problems).
3. Optional: a site-only email alias on the domain (Cloudflare Email Routing → forward
   `hello@<domain>` to the real inbox), then use it in `src/data/profile.ts`.
4. `pnpm check:launch` must now pass: no `PLACEHOLDER`, no `example.com`. Then make it strict in
   CI by removing `--warn` from the workflow step.
5. `pnpm build && pnpm cv:pdf`, commit, merge.

## 3. Verify production

- [ ] `/release-check` against the live URL: every route in both languages, 404s in both
      languages (`/nope` and `/it/nope`), CV PDFs download, no console errors.
- [ ] Security headers: [securityheaders.com](https://securityheaders.com) scores A or better;
      the browser console shows no CSP violations with Web Analytics enabled.
- [ ] Lighthouse ≥ 90 on `/` and `/it/` (CI already enforces this on every PR).
- [ ] Link previews: LinkedIn [Post Inspector](https://www.linkedin.com/post-inspector/),
      WhatsApp and Slack show the card with the right title in each language.

## 4. Search

1. [Google Search Console](https://search.google.com/search-console) → Add property → Domain →
   verify with the DNS TXT record (one click on Cloudflare).
2. Sitemaps → submit `https://<domain>/sitemap-index.xml`.
3. Optional: the same in Bing Webmaster Tools (it can import from Search Console).

## 5. After a week

- [ ] Raise HSTS to a year (**Claude**).
- [ ] Look at Web Analytics and Search Console once; nothing needs tuning unless something is
      broken.
