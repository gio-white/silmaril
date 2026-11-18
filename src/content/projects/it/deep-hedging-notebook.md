---
# PLACEHOLDER — progetto di esempio inventato (traduzione di en/deep-hedging-notebook.md).
title: Deep hedging, riprodotto
summary: Un notebook che ricostruisce l'esperimento centrale della mia tesi, confrontando il delta hedging con una strategia di copertura appresa.
problem: >-
  Gli articoli sul deep hedging riportano risultati difficili da riprodurre: il codice raramente è
  pubblicato, e piccole scelte nel mercato simulato cambiano la risposta.
approach: >-
  Un notebook autonomo che simula un mercato, addestra una piccola rete neurale a coprire
  un'opzione e la confronta con il delta hedging classico in presenza di costi di transazione.
outcome: >-
  Con costi proporzionali dell'1% la strategia appresa ha ridotto di circa un terzo la dispersione
  del P&L di copertura nell'esecuzione di esempio.
stack:
  - Python
  - PyTorch
  - NumPy
featured: true
order: 30
kind: side
period: '2024'
role: Da solo
status: archived
tags:
  - Finanza quantitativa
  - Reinforcement learning
---
