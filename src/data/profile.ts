/**
 * The site's singleton content: who this is and how to reach them.
 *
 * A plain typed module rather than a content collection, because a collection
 * of exactly one entry is awkward to read and awkward to query. Everything
 * that is a *list* lives in src/content/.
 *
 * Sourced from Giorgio's CV; see docs/content-source.md. Metrics use only
 * figures the CV supports.
 */

export interface Metric {
  label: string;
  value: string;
}

export interface Profile {
  name: string;
  role: string;
  /** One sentence. Should contain a real number. */
  positioning: string;
  about: string[];
  metrics: Metric[];
  location: string;
  timezone: string;
  availability: string;
  email: string;
  github: string;
  linkedin: string;
  /** Served from public/. */
  cvPath: string;
}

export const profile: Profile = {
  name: 'Giorgio Bianchini',
  role: 'Data & AI Engineer',
  positioning:
    'I build Databricks data platforms and the AI agents on top of them, so a global business can trust its numbers and ask them questions.',
  about: [
    'I came to data from business economics, and I now work as a data engineer at KPMG Italy. For more than two years I have been building Databricks and Microsoft Azure platforms for a multinational industrial client: ingestion and Medallion pipelines, dimensional models and the KPIs behind executive Power BI reporting.',
    'More and more of my work is applied AI. I am building LLM agents on Microsoft Foundry that answer business questions over governed data, and bringing CI/CD to our Databricks projects with Declarative Automation Bundles. I work directly with business stakeholders and coordinate a small team of engineers, which is where most of the design decisions actually get made.',
  ],
  metrics: [
    { label: 'Years in data engineering', value: '2+' },
    { label: 'Certifications', value: '8' },
    { label: 'Global regions in one model', value: '5' },
    { label: 'Engineers coordinated', value: '~5' },
  ],
  location: 'Rome, Italy',
  timezone: 'CET / UTC+1',
  availability: 'Open to roles across Europe and relocation',
  email: 'gio.whiteh@gmail.com',
  github: 'https://github.com/gio-white',
  linkedin: 'https://www.linkedin.com/in/giorgio-bianchini',
  cvPath: '/cv.pdf',
};
