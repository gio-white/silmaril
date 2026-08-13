---
title: Schema contracts between teams
summary: A lightweight contract layer that took schema-drift incidents from eleven a year to one.
problem: >-
  Upstream services changed column types and nullability without notice. The reporting layer found
  out when a dashboard went blank, usually on a Monday.
approach: >-
  A declarative contract per ingestion source, checked in CI on the producer side and again at
  load time. Breaking changes fail the producer's build; additive ones pass silently.
outcome: >-
  Schema-drift incidents fell from 11 in the preceding year to 1, and the remaining one was caught
  in CI rather than in production.
stack:
  - Python
  - Great Expectations
  - GitHub Actions
featured: true
order: 30
---
