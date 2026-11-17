---
# PLACEHOLDER — fictional sample project. Replace or delete before launch.
title: Unity Catalog access check
summary: A command-line tool that tests row filters and column masks against personas before they ship.
problem: >-
  Row filters and column masks are easy to write and hard to verify. A wrong predicate shows a
  region's sales to the wrong group, and nobody finds out until someone asks why a number looks
  too big.
approach: >-
  Declare personas and the rows and columns each should see in a YAML file; the tool impersonates
  each group through a service principal, runs the queries, and diffs what came back against what
  was declared.
outcome: >-
  Access rules become tests that run in CI, and a sample policy of 12 rules went from manual spot
  checks to a 40-second automated run.
stack:
  - Python
  - Unity Catalog
  - Databricks SDK
featured: true
order: 20
links:
  repo: https://github.com/gio-white/uc-access-check
---
