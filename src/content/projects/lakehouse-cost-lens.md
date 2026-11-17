---
# PLACEHOLDER — fictional sample project, so the layout and behaviour can be
# reviewed before real public projects exist. Replace or delete before launch;
# `pnpm check:launch` fails while this marker is present.
title: Lakehouse cost lens
summary: A small open-source dashboard that shows what each Databricks pipeline costs, per run and per month.
problem: >-
  Databricks bills by compute, but teams think in pipelines. Nobody could say which job had made
  last month's bill grow, so cost reviews turned into guesswork across dozens of jobs.
approach: >-
  A set of SQL views over Databricks system tables that join billing usage to jobs, clusters and
  tags, packaged as a Databricks Asset Bundle with a Lakeview dashboard on top.
outcome: >-
  Every job's cost traced to its owner in one view; the sample workspace found two forgotten
  all-purpose clusters worth about a fifth of its monthly spend.
stack:
  - Databricks
  - SQL
  - System tables
  - DABs
featured: true
order: 10
kind: side
period: '2026'
role: Solo
status: live
tags:
  - Cost
  - Observability
cover:
  src: ../../assets/projects/lakehouse-cost-lens.png
  alt: Bar chart of monthly cost per pipeline, with an idle cluster far above the threshold line.
links:
  repo: https://github.com/gio-white/lakehouse-cost-lens
---

## PLACEHOLDER case study

This sample page shows how a full write-up renders: headings, prose, a table and a list. It is
fictional.

### The constraint

System tables lag real usage by a few hours and keep 365 days of history, so the views had to be
incremental and the dashboard had to say how fresh its numbers were.

### What was tried first

A notebook that called the REST APIs for every job. It was slow, needed a personal token, and
broke whenever a workspace had more than a thousand runs a day. Reading the system tables directly
removed all three problems.

### What the numbers were

| Measure | Before | After |
| --- | --- | --- |
| Time to answer "what does this job cost?" | ~1 day | Seconds |
| Jobs with a known owner | ~40% | 100% |
| Idle all-purpose clusters found | — | 2 |

- Runs in any workspace with Unity Catalog enabled.
- No tokens: everything is read through the workspace's own SQL warehouse.
