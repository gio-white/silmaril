/**
 * The site's singleton content: who this is and how to reach them.
 *
 * A plain typed module rather than a content collection, because a collection
 * of exactly one entry is awkward to read and awkward to query. Everything
 * that is a *list* lives in src/content/.
 *
 * PLACEHOLDER. Replace with real values — see docs/content-intake.md.
 * The placeholders are deliberately awkward (a long name, a long positioning
 * line) so the layout is stress-tested rather than tuned to convenient text.
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
  name: 'Alessandro Bernardini',
  role: 'Data Engineer',
  positioning:
    'I build batch and streaming pipelines that move around 2.4 TB a day, and I spend most of my time making sure the numbers at the end of them are ones people can trust.',
  about: [
    'I work on the unglamorous half of data: ingestion, modelling, orchestration and the alerting that tells you when any of it has quietly stopped being true. Most of what I have built has been in regulated environments, where a wrong figure is a bigger problem than a late one.',
    'My preference is for boring, observable systems — small well-understood components, explicit contracts between them, and enough instrumentation that a failure explains itself before anyone has to open a notebook to investigate.',
  ],
  metrics: [
    { label: 'Years in data engineering', value: '6' },
    { label: 'Peak daily volume', value: '2.4 TB' },
    { label: 'Pipelines in production', value: '40+' },
    { label: 'Reporting uptime', value: '99.95%' },
  ],
  location: 'Milan, Italy',
  timezone: 'CET / UTC+1',
  availability: 'Open to contract and full-time roles',
  email: 'hello@example.com',
  github: 'https://github.com/example',
  linkedin: 'https://www.linkedin.com/in/example',
  cvPath: '/cv.pdf',
};
