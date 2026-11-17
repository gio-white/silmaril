---
# PLACEHOLDER — fictional sample project. Replace or delete before launch.
title: Deep hedging, reproduced
summary: A notebook that rebuilds the core experiment from my thesis, comparing delta hedging with a learned hedging policy.
problem: >-
  Papers on deep hedging report results that are hard to reproduce: the code is rarely published,
  and small choices in the simulated market change the answer.
approach: >-
  A self-contained notebook that simulates a market, trains a small neural policy to hedge an
  option, and compares it with classical delta hedging under transaction costs.
outcome: >-
  Under 1% proportional costs the learned policy cut the spread of hedging P&L by about a third
  in the sample run.
stack:
  - Python
  - PyTorch
  - NumPy
featured: true
order: 30
kind: side
period: '2024'
role: Solo
status: archived
tags:
  - Quantitative finance
  - Reinforcement learning
---
