---
title: Streaming settlement reconciliation
summary: Matching four million daily payment transactions against scheme settlement files in near real time.
problem: >-
  Reconciliation ran once a day as a batch job. A mismatch introduced at 09:00 was not visible
  until the following morning, which meant roughly 20 hours of continued processing on data that
  was already known to be wrong by the time anyone looked.
approach: >-
  Replaced the batch job with a Kafka Streams topology keyed on transaction reference, holding a
  windowed state store long enough to absorb late-arriving settlement files. Unmatched records
  fall through to a dead-letter topic with the reason attached, so triage starts from a cause
  rather than a diff.
outcome: >-
  p99 end-to-end latency of 90 seconds against a 4.1M daily volume, and mismatch detection moved
  from next-day to same-minute.
stack:
  - Kafka Streams
  - Python
  - Delta Lake
  - Azure
featured: true
order: 10
links:
  repo: https://github.com/example/settlement-reconciliation
---

## PLACEHOLDER case study

This body becomes the `/projects/<slug>` detail page. Projects without a body get a card on the
listing and no detail page, which is the mechanism that stops thin projects from generating empty
pages.

Replace this with the real write-up: the constraint that shaped the design, what was tried first
and abandoned, and the measurement that showed it worked.

### What made it hard

Late-arriving settlement files. A scheme could deliver a file up to six hours after the
transactions it covered, so a naive join dropped roughly 3% of matches and generated false
mismatches that were more expensive to investigate than the original problem.

### What the numbers were

| Measure | Before | After |
| --- | --- | --- |
| Detection latency | ~20 hours | 90 seconds (p99) |
| False mismatch rate | 3.1% | 0.04% |
| Manual triage time | ~6 h/week | ~20 min/week |
