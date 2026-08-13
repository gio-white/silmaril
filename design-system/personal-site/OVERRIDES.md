# Implemented overrides

`MASTER.md` is the skill's generated recommendation. This file records what the
site actually ships, where the two disagree. The implemented source of truth
for tokens is `src/styles/tokens.css`. Reasons live in `docs/decisions.md`.

| Skill (`MASTER.md`) | Implemented | Why |
| --- | --- | --- |
| Palette: zinc + `#2563EB` | Blueprint-and-oxide (`#EDF0F2` / `#B23A16` / `#0E6B63`) | Skill returned verbatim Tailwind defaults. The brief is to avoid a templated look. |
| Body: Space Grotesk | Public Sans | Space Grotesk and Inter are the over-used defaults the brief rules out. |
| Motion-Driven style, GSAP snippets | CSS scroll-driven + ~1 kB IntersectionObserver fallback | Zero-byte motion; GSAP would add a library for something CSS already does. |
| Google Fonts CSS import | Self-hosted, instanced WOFF2 | A font CDN is a critical-path round trip and a privacy footnote. |
| Masonry project grid | Two-up CSS grid becoming a stack | Masonry is a layout gimmick; case studies need even columns and readable Problem / Approach / Outcome. |

Do not "fix" the implemented tokens to match `MASTER.md`. If the skill is
re-run with `--force`, reconcile here rather than overwriting `tokens.css`.
