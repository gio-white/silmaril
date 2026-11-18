import type { Dictionary } from './en';

/** Italian interface strings. Typed against the English dictionary, so a key
 *  missing here is a type error rather than a blank on the live site. */
export const it: Dictionary = {
  layout: {
    skipLink: 'Vai al contenuto',
    primaryNav: 'Principale',
    siteSections: 'Sezioni del sito',
    onThisPage: 'In questa pagina',
    secondaryNav: 'Altro',
    language: 'Lingua',
  },
  theme: {
    legend: 'Tema colori',
    light: 'Chiaro',
    system: 'Come il sistema',
    dark: 'Scuro',
  },
  nav: {
    home: 'Home',
    projects: 'Progetti',
    experience: 'Esperienza',
    skills: 'Competenze',
    contact: 'Contatti',
    now: 'Ora',
    cv: 'CV',
    about: 'Chi sono',
    credentials: 'Certificazioni',
  },
  hero: {
    getInTouch: 'Contattami',
    downloadCv: 'Scarica il CV',
  },
  about: { label: 'Chi sono', title: 'Di cosa mi occupo' },
  projects: {
    label: 'Lavori scelti',
    title: 'Progetti',
    all: (count: number) => `Tutti i ${count} progetti`,
    problem: 'Problema',
    approach: 'Approccio',
    outcome: 'Risultato',
    topics: 'Temi',
    stack: 'Stack',
    stackOf: (name: string) => `Stack di ${name}`,
    confidentialCard: 'Lavoro per un cliente; dettagli anonimizzati.',
    confidentialCase:
      'Lavoro per un cliente, soggetto a riservatezza: i nomi sono anonimizzati e le cifre sono indicate come intervalli.',
    links: { repo: 'Repo', demo: 'Demo', writeup: 'Articolo' },
    status: { live: 'Online', archived: 'Archiviato', internal: 'Interno' },
  },
  experience: {
    label: 'Esperienza',
    title: 'Dove ho lavorato',
    full: 'Percorso completo',
    education: 'Formazione',
  },
  skills: { label: 'Stack', title: 'Con cosa lavoro', full: 'Stack completo' },
  certifications: {
    label: 'Credenziali',
    title: 'Certificazioni',
    all: (count: number) => `Tutte le ${count}`,
    expires: 'Scade',
    expired: 'Scaduta',
  },
  contact: {
    label: 'Contatti',
    title: 'Scrivimi',
    lead: (availability: string, location: string, timezone: string) =>
      `${availability}. Vivo a ${location}, fuso orario ${timezone}.`,
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'CV',
    downloadPdf: 'Scarica il PDF',
  },
  dates: { present: 'Oggi' },
  fallback: 'Non ancora tradotto; mostrato in inglese.',
  pages: {
    projects: {
      title: 'Progetti',
      description: (name: string) =>
        `Progetti pubblici scelti di ${name}: piattaforme dati, governance e AI applicata.`,
    },
    experience: {
      title: 'Esperienza',
      description: (name: string, role: string) =>
        `Esperienza lavorativa e formazione di ${name}, ${role}.`,
    },
    skills: {
      title: 'Competenze',
      description: (name: string, role: string) =>
        `Strumenti, piattaforme e certificazioni di ${name}, ${role}.`,
    },
    now: {
      title: 'Ora',
      description: (name: string) => `Su cosa sta lavorando ${name} in questo momento.`,
      label: 'Ora',
      heading: 'Su cosa sto lavorando',
      updated: 'Aggiornato il',
    },
    cv: {
      title: 'CV',
      description: (name: string, role: string) => `Curriculum vitae di ${name}, ${role}.`,
      profile: 'Profilo',
      experience: 'Esperienza',
      skills: 'Competenze',
      certifications: 'Certificazioni',
      education: 'Formazione',
      downloadPdf: 'Scarica il PDF',
    },
    notFound: {
      title: 'Pagina non trovata',
      description: 'Questa pagina non esiste.',
      heading: 'Qui non c’è niente',
      text: 'La pagina che cerchi non esiste, oppure è stata spostata. Nella home trovi tutto in un unico posto.',
      home: 'Torna alla home',
      contact: 'Contattami',
    },
  },
};
