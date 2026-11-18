/**
 * English interface strings. The Italian dictionary must have exactly this
 * shape (`Dictionary`), so a missing key fails `astro check`.
 *
 * Content (roles, projects, the profile text) is not here: it lives in
 * src/content/<collection>/<locale>/ and src/data/profile.ts.
 */
export const en = {
  layout: {
    skipLink: 'Skip to content',
    primaryNav: 'Primary',
    siteSections: 'Site sections',
    onThisPage: 'On this page',
    secondaryNav: 'More',
    language: 'Language',
  },
  theme: {
    legend: 'Colour theme',
    light: 'Light',
    system: 'Match system',
    dark: 'Dark',
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    experience: 'Experience',
    skills: 'Skills',
    contact: 'Contact',
    now: 'Now',
    cv: 'CV',
    about: 'About',
    credentials: 'Credentials',
  },
  hero: {
    getInTouch: 'Get in touch',
    downloadCv: 'Download CV',
  },
  about: { label: 'About', title: 'What I work on' },
  projects: {
    label: 'Selected work',
    title: 'Projects',
    all: (count: number) => `All ${count} projects`,
    problem: 'Problem',
    approach: 'Approach',
    outcome: 'Outcome',
    topics: 'Topics',
    stack: 'Stack',
    stackOf: (name: string) => `${name} stack`,
    confidentialCard: 'Client work; details anonymised.',
    confidentialCase:
      'Client work under confidentiality: names are anonymised and figures are given as ranges.',
    links: { repo: 'Repo', demo: 'Demo', writeup: 'Write-up' } as Record<string, string>,
    status: { live: 'Live', archived: 'Archived', internal: 'Internal' },
  },
  experience: {
    label: 'Experience',
    title: "Where I've worked",
    full: 'Full history',
    education: 'Education',
  },
  skills: { label: 'Stack', title: 'What I work with', full: 'Full stack' },
  certifications: {
    label: 'Credentials',
    title: 'Certifications',
    all: (count: number) => `All ${count}`,
    expires: 'Expires',
    expired: 'Expired',
  },
  contact: {
    label: 'Contact',
    title: 'Get in touch',
    lead: (availability: string, location: string, timezone: string) =>
      `${availability}. Based in ${location}, working ${timezone}.`,
    email: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    cv: 'CV',
    downloadPdf: 'Download PDF',
  },
  dates: { present: 'Present' },
  fallback: 'Not translated yet; shown in English.',
  pages: {
    projects: {
      title: 'Projects',
      description: (name: string) =>
        `Selected public projects by ${name}: data platforms, governance and applied AI.`,
    },
    experience: {
      title: 'Experience',
      description: (name: string, role: string) =>
        `Work history and education for ${name}, ${role}.`,
    },
    skills: {
      title: 'Skills',
      description: (name: string, role: string) =>
        `Tools, platforms and certifications for ${name}, ${role}.`,
    },
    now: {
      title: 'Now',
      description: (name: string) => `What ${name} is focused on at the moment.`,
      label: 'Now',
      heading: "What I'm working on",
      updated: 'Updated',
    },
    cv: {
      title: 'CV',
      description: (name: string, role: string) => `Curriculum vitae of ${name}, ${role}.`,
      profile: 'Profile',
      experience: 'Experience',
      skills: 'Skills',
      certifications: 'Certifications',
      education: 'Education',
      downloadPdf: 'Download PDF',
    },
    notFound: {
      title: 'Page not found',
      description: 'This page does not exist.',
      heading: 'Nothing plotted here',
      text: 'The page you asked for does not exist, or it has moved. The home page has everything in one place.',
      home: 'Back to the home page',
      contact: 'Get in touch',
    },
  },
};

export type Dictionary = typeof en;
