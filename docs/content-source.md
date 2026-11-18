# Content source

Where every fact on the site comes from, so the site and the CV cannot quietly disagree.

**Source:** Giorgio's CV, the "CV Giorgio Bianchini" design (Switzerland version, pages 1–2, as of
November 2026). Anything not in the CV is listed under *Open items* rather than invented.

## Decisions applied

| Topic | Decision |
| --- | --- |
| Role line | "Data & AI Engineer" |
| Positioning | "I build Databricks data platforms and the AI agents on top of them, so a global business can trust its numbers and ask them questions." |
| Client | Anonymised as "a multinational agricultural machinery manufacturer". KPMG is named as employer. No internal figures or screenshots. |
| Projects | The CV's work projects are described inside the work history, not as project cards. `/projects` is for public projects only; until those exist it holds three clearly marked fictional samples, and the site does not launch with them. |
| Contact | Email, LinkedIn and GitHub are public. Phone number and street address never appear. |
| Availability | "Open to roles across Europe and relocation". |
| Metrics | Only figures the CV supports: 2+ years, 8 certifications, 5 regions in one model, ~5 engineers coordinated. |
| Headshot | None. |
| Personal line in About | Left out for now. |

## Extraction

### Profile

- **Name:** Giorgio Bianchini
- **Location:** Rome, Italy (EU citizen, open to relocation)
- **Email:** gio.whiteh@gmail.com
- **LinkedIn:** linkedin.com/in/giorgio-bianchini
- **GitHub:** github.com/gio-white
- **Languages:** Italian (native), English (C1, daily working language with global client teams)

### Work history (KPMG Italy, Nov 2024 – present)

| Role | Dates | File |
| --- | --- | --- |
| Senior Consultant — Data Engineer | Oct 2026 – present | `src/content/roles/en/01-kpmg-senior-consultant.yaml` |
| Consultant — Data Engineer | Mar 2025 – Sep 2026 | `src/content/roles/en/02-kpmg-consultant.yaml` |
| Intern — Data Engineer | Nov 2024 – Feb 2025 | `src/content/roles/en/03-kpmg-intern.yaml` |

Highlights are condensed from the CV bullets: technical lead on the global aftermarket analytics
programme, coordination of about five engineers, Foundry agents behind an orchestrator (first one
in pilot via Teams and a portal), DABs CI/CD through Azure DevOps across Dev / Cert / Prod, Unity
Catalog governance; the five-region sales-potential model feeding executive Power BI, harmonising
six kinds of regional source, the firm-wide Databricks orchestration framework with Zabbix
alerting, Liquid Clustering tuning; and the logistics internship (multi-carrier freight, Auto
Loader and Spark Declarative Pipelines, Medallion with SCD 1/2 and CDC).

### Education

| Qualification | Institution | Dates | File |
| --- | --- | --- | --- |
| Data Engineering bootcamp | Generation Italy | Jun – Oct 2024 | `src/content/education/en/01-generation.yaml` |
| BSc Business Economics | Roma Tre University | Graduated Mar 2024 | `src/content/education/en/02-roma-tre.yaml` |

Thesis: "From Delta Hedging to Deep Hedging".

### Certifications

| Certification | Issuer | Earned |
| --- | --- | --- |
| Generative AI Engineer Associate | Databricks | Sep 2026 |
| Data Engineer Professional | Databricks | Jun 2026 |
| Data Engineer Associate | Databricks | Feb 2026 |
| OCI Generative AI Professional | Oracle | Oct 2025 |
| OCI Generative AI Associate | Oracle | Oct 2025 |
| PL-300 Power BI Data Analyst | Microsoft | Apr 2024 |
| Advanced Data Analytics | Google | Nov 2023 |
| Data Analytics | Google | Aug 2023 |

### Skills

Grouped as Data platforms · Data modelling · AI & agents · BI & analytics · Programming · Cloud ·
Engineering practice · Spoken languages, from the CV's core skills and certification topics.

Every entry also has an Italian version in the matching `it/` folder, drafted from the English.
**Please review the Italian too**: it is a first draft.

## Open items for Giorgio

- [ ] **Credential links and expiry dates** for each certification (the CV has neither). Databricks
      and Microsoft certifications expire; the site shows "Expires" / "Expired" once the date is in.
- [ ] **Stronger numbers** for the role highlights if you can publish them: data volumes, run
      times, cost or time saved, number of users of the Power BI app or the agent pilot.
- [ ] **Roma Tre start year** (only the graduation date is in the CV).
- [ ] **A personal line** for About, when you want one.
- [ ] **Real public projects** to replace the three samples in `src/content/projects/en/` (and `it/`).
