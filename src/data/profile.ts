import { defaultLocale, type Locale } from '../i18n';

/**
 * The site's singleton content: who this is and how to reach them.
 *
 * A plain typed module rather than a content collection, because a collection
 * of exactly one entry is awkward to read and awkward to query. Everything
 * that is a *list* lives in src/content/.
 *
 * Sourced from Giorgio's CV; see docs/content-source.md. Metrics use only
 * figures the CV supports. Contact details are shared; the prose is per
 * locale, and `getProfile` merges the two.
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
  /** Served from public/; printed from /cv by `pnpm cv:pdf`. */
  cvPath: string;
}

type SharedFields = 'name' | 'timezone' | 'email' | 'github' | 'linkedin';

const shared: Pick<Profile, SharedFields> = {
  name: 'Giorgio Bianchini',
  timezone: 'CET / UTC+1',
  email: 'gio.whiteh@gmail.com',
  github: 'https://github.com/gio-white',
  linkedin: 'https://www.linkedin.com/in/giorgio-bianchini',
};

const text: Record<Locale, Omit<Profile, SharedFields>> = {
  en: {
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
    availability: 'Open to roles across Europe and relocation',
    cvPath: '/cv.pdf',
  },
  it: {
    role: 'Data & AI Engineer',
    positioning:
      'Costruisco piattaforme dati su Databricks e gli agenti AI che ci lavorano sopra, perché un’azienda globale possa fidarsi dei propri numeri e interrogarli.',
    about: [
      'Sono arrivato ai dati dall’economia aziendale, e oggi lavoro come data engineer in KPMG Italia. Da più di due anni costruisco piattaforme Databricks e Microsoft Azure per un cliente industriale multinazionale: pipeline di ingestion e Medallion, modelli dimensionali e i KPI alla base del reporting Power BI per il management.',
      'Una parte sempre più grande del mio lavoro è AI applicata. Sviluppo agenti LLM su Microsoft Foundry che rispondono a domande di business su dati governati, e sto portando la CI/CD nei nostri progetti Databricks con i Declarative Automation Bundles. Lavoro a stretto contatto con gli stakeholder di business e coordino un piccolo team di engineer: è lì che si prende davvero la maggior parte delle decisioni di design.',
    ],
    metrics: [
      { label: 'Anni nel data engineering', value: '2+' },
      { label: 'Certificazioni', value: '8' },
      { label: 'Regioni globali in un modello', value: '5' },
      { label: 'Engineer coordinati', value: '~5' },
    ],
    location: 'Roma, Italia',
    availability: 'Disponibile per ruoli in Europa e al trasferimento',
    cvPath: '/cv-it.pdf',
  },
};

export function getProfile(locale: Locale = defaultLocale): Profile {
  return { ...shared, ...text[locale] };
}

/** The English profile, for places with no locale (build scripts). */
export const profile = getProfile(defaultLocale);
