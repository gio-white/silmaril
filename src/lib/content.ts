import { type CollectionEntry, getCollection } from 'astro:content';

/**
 * Content queries and date formatting.
 *
 * Sorting lives here rather than in the sections, so the home page and the
 * dedicated page cannot drift into different orders — they call the same
 * function and one passes a limit.
 */

/** Sortable key from `YYYY-MM`; open-ended entries sort first. */
function chronoKey(value: string | undefined): string {
  return value ?? '9999-99';
}

export async function getRoles(): Promise<CollectionEntry<'roles'>[]> {
  const roles = await getCollection('roles');
  return roles.sort((a, b) => b.data.start.localeCompare(a.data.start));
}

export async function getEducation(): Promise<CollectionEntry<'education'>[]> {
  const education = await getCollection('education');
  return education.sort((a, b) => b.data.end.localeCompare(a.data.end));
}

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects');
  return projects.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export async function getFeaturedProjects(): Promise<CollectionEntry<'projects'>[]> {
  return (await getProjects()).filter((project) => project.data.featured);
}

export async function getCertifications(): Promise<CollectionEntry<'certifications'>[]> {
  const certifications = await getCollection('certifications');
  return certifications.sort((a, b) => chronoKey(b.data.earned).localeCompare(a.data.earned));
}

export async function getSkills(): Promise<CollectionEntry<'skills'>[]> {
  const skills = await getCollection('skills');
  return skills.sort(
    (a, b) => a.data.order - b.data.order || a.data.group.localeCompare(b.data.group),
  );
}

/**
 * A project earns a detail page only if it has a body. This is what stops
 * thin entries from generating empty pages.
 */
export function hasCaseStudy(project: CollectionEntry<'projects'>): boolean {
  return (project.body ?? '').trim().length > 0;
}

const STATUS_LABELS = { live: 'Live', archived: 'Archived', internal: 'Internal' } as const;

/** The short mono line above a project title: period, who built it, status. */
export function projectMeta(project: CollectionEntry<'projects'>): string[] {
  const { period, role, status } = project.data;
  return [period, role, status && STATUS_LABELS[status]].filter((part): part is string =>
    Boolean(part),
  );
}

/** Confidential projects never expose repository or demo links. */
export function publicLinks(project: CollectionEntry<'projects'>): [string, string][] {
  if (project.data.confidential) return [];
  return Object.entries(project.data.links).filter((entry): entry is [string, string] =>
    Boolean(entry[1]),
  );
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2023-04` -> `Apr 2023`. */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  return `${MONTHS[index] ?? month} ${year}`;
}

/** Open-ended ranges read as "Present" rather than trailing off. */
export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

/** Machine-readable equivalent for <time datetime>. */
export function isoMonth(value: string): string {
  return value;
}
