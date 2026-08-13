---
title: Warehouse cost teardown
summary: Cutting a Snowflake bill by 38% without removing a single thing anyone was actually using.
problem: >-
  Warehouse spend had grown 4x in eighteen months with no corresponding growth in either data
  volume or user count. Nobody could say which queries were responsible, because the cost
  attribution stopped at the warehouse level.
approach: >-
  Built a query-attribution model joining query history to dbt model lineage and dashboard usage,
  which made it possible to put a monthly euro figure against each model. Then re-sorted the
  expensive tables on the keys they were genuinely filtered by, and retired the assets that had
  no reads at all.
outcome: >-
  38% reduction, about €11k per month, with no change to any dashboard that had been opened in
  the previous six months.
stack:
  - Snowflake
  - dbt
  - Python
featured: true
order: 20
---

## PLACEHOLDER case study

Replace with the real write-up. The interesting part of this kind of work is usually the
attribution model rather than the optimisation, because that is what turns an argument about
opinions into an argument about numbers.
