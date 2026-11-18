---
# PLACEHOLDER — progetto di esempio inventato (traduzione di en/uc-access-check.md).
title: Unity Catalog access check
summary: Uno strumento a riga di comando che verifica row filter e column mask sulle persona prima del rilascio.
problem: >-
  Row filter e column mask sono facili da scrivere e difficili da verificare. Un predicato
  sbagliato mostra le vendite di una regione al gruppo sbagliato, e nessuno se ne accorge finché
  qualcuno non chiede perché un numero sembra troppo alto.
approach: >-
  Si dichiarano in un file YAML le persona e le righe e colonne che ognuna deve vedere; lo
  strumento impersona ogni gruppo tramite un service principal, esegue le query e confronta il
  risultato con quanto dichiarato.
outcome: >-
  Le regole di accesso diventano test eseguiti in CI, e una policy di esempio di 12 regole è
  passata dai controlli manuali a un'esecuzione automatica di 40 secondi.
stack:
  - Python
  - Unity Catalog
  - Databricks SDK
featured: true
order: 20
kind: work
period: 2025 – 2026
role: Team di 3
status: internal
confidential: true
tags:
  - Governance
  - Test
links:
  repo: https://github.com/gio-white/uc-access-check
---
