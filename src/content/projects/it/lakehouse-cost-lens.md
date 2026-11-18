---
# PLACEHOLDER — progetto di esempio inventato (traduzione di en/lakehouse-cost-lens.md).
# Da sostituire o eliminare prima del lancio.
title: Lakehouse cost lens
summary: Una piccola dashboard open source che mostra quanto costa ogni pipeline Databricks, per esecuzione e per mese.
problem: >-
  Databricks fattura il compute, ma i team ragionano per pipeline. Nessuno sapeva dire quale job
  avesse fatto crescere la fattura del mese scorso, e le revisioni dei costi diventavano
  congetture su decine di job.
approach: >-
  Un insieme di viste SQL sulle system table di Databricks che collegano l'uso fatturato a job,
  cluster e tag, distribuito come Databricks Asset Bundle con una dashboard Lakeview sopra.
outcome: >-
  Il costo di ogni job ricondotto al suo responsabile in un'unica vista; nel workspace di esempio
  sono emersi due cluster all-purpose dimenticati che valevano circa un quinto della spesa mensile.
stack:
  - Databricks
  - SQL
  - System tables
  - DABs
featured: true
order: 10
kind: side
period: '2026'
role: Da solo
status: live
tags:
  - Costi
  - Osservabilità
cover:
  src: ../../../assets/projects/lakehouse-cost-lens.png
  alt: Grafico a barre del costo mensile per pipeline, con un cluster inattivo molto sopra la soglia.
links:
  repo: https://github.com/gio-white/lakehouse-cost-lens
---

## PLACEHOLDER case study

Questa pagina di esempio mostra come appare un approfondimento completo: titoli, testo, una tabella
e un elenco. È inventata.

### Il vincolo

Le system table sono in ritardo di qualche ora sull'uso reale e conservano 365 giorni di storico,
quindi le viste dovevano essere incrementali e la dashboard doveva dire quanto erano aggiornati i
suoi numeri.

### Cosa ho provato prima

Un notebook che chiamava le REST API per ogni job. Era lento, richiedeva un token personale e si
rompeva quando un workspace superava le mille esecuzioni al giorno. Leggere direttamente le system
table ha eliminato tutti e tre i problemi.

### I numeri

| Misura | Prima | Dopo |
| --- | --- | --- |
| Tempo per sapere "quanto costa questo job?" | ~1 giorno | Secondi |
| Job con un responsabile noto | ~40% | 100% |
| Cluster all-purpose inattivi trovati | — | 2 |

- Funziona in qualsiasi workspace con Unity Catalog attivo.
- Nessun token: tutto viene letto tramite il SQL warehouse del workspace.
