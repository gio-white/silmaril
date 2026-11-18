---
description: Scaffold a new project entry in src/content/projects from a short description
argument-hint: <title or a few lines about the project>
---

Add a project to the site from this description: $ARGUMENTS

1. Read `src/content.config.ts` (the `projects` schema) and one existing file in
   `src/content/projects/` so the new entry matches the current fields exactly.
2. Choose a short, URL-safe slug; the file is `src/content/projects/en/<slug>.md`. Then draft the
   Italian version with the same file name in `src/content/projects/it/` for me to review.
3. Fill the front matter: `title`, a one-line `summary`, and `problem` → `approach` → `outcome`.
   The outcome carries a measured number. Ask me for any fact you do not have; never invent
   figures, clients or dates.
4. If the work is under a contract or NDA, anonymise it ("a global manufacturer"), use ranges
   instead of exact figures, and leave out repository links.
5. Leave the body empty unless I gave a long-form write-up: a body creates a `/projects/<slug>`
   case-study page, and an empty one would be a thin page.
6. Run `pnpm check` and `pnpm build`, then show me the new card at `/projects`.
