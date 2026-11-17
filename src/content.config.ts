import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported from zod directly: astro:content still re-exports `z`, but marks it
// deprecated now that Astro 7 ships Zod 4.
import * as z from 'zod';

/**
 * Content collections. Every CV fact on the site comes from here.
 *
 * One file per entry rather than one file per collection: a job or a project
 * is then a self-contained diff, which matters when the history of your own CV
 * is something you might want to read.
 *
 * Schemas are strict on purpose. A missing date should fail the build loudly,
 * not render an empty gap on the live site.
 */

/** `YYYY-MM`. Kept as a string rather than a Date so YAML stays readable and
 *  timezone drift cannot silently move a start date across a month boundary. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'expected YYYY-MM');

const yearOnly = z.string().regex(/^\d{4}$/, 'expected YYYY');

const roles = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/roles' }),
  schema: z.object({
    company: z.string(),
    /** Five words at most, only when the company name is not self-explanatory. */
    companyNote: z.string().optional(),
    role: z.string(),
    start: yearMonth,
    /** Omitted means current. */
    end: yearMonth.optional(),
    location: z.string().optional(),
    stack: z.array(z.string()).default([]),
    /** Each should carry a number where one exists. Bullets without one are
     *  what makes a CV forgettable. */
    highlights: z.array(z.string()).min(1),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    qualification: z.string(),
    field: z.string(),
    /** Omitted when only the completion year is known. */
    start: yearOnly.optional(),
    end: yearOnly,
    note: z.string().optional(),
  }),
});

const projects = defineCollection({
  // Markdown so a project can carry a full case study in its body. Projects
  // without one simply have an empty body and get no detail page.
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      problem: z.string(),
      approach: z.string(),
      outcome: z.string(),
      stack: z.array(z.string()).default([]),
      links: z
        .object({
          repo: z.url().optional(),
          demo: z.url().optional(),
          writeup: z.url().optional(),
        })
        .default({}),
      /** Surfaced on the home page. */
      featured: z.boolean().default(false),
      /** Lower sorts first. Ties fall back to title. */
      order: z.number().default(100),
      /** Optimised by astro:assets. Alt text is required: a cover is content. */
      cover: z.object({ src: image(), alt: z.string().min(1) }).optional(),
      /** A year or a range as it should read, e.g. "2026" or "2024 – 2025". */
      period: z.string().optional(),
      /** Who built it, e.g. "Solo" or "Team of 4". */
      role: z.string().optional(),
      status: z.enum(['live', 'archived', 'internal']).optional(),
      /** Topics rather than tools (the tools are `stack`). */
      tags: z.array(z.string()).default([]),
      /** Work under NDA: repository links are hidden and the page says details
       *  are anonymised. */
      confidential: z.boolean().default(false),
      /** One collection for client work and side projects, so a future /lab
       *  page is a filter rather than a second content model. */
      kind: z.enum(['work', 'side']).default('work'),
    }),
});

const certifications = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/certifications' }),
  schema: z.object({
    issuer: z.string(),
    name: z.string(),
    earned: yearMonth,
    expires: yearMonth.optional(),
    credentialUrl: z.url().optional(),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/skills' }),
  schema: z.object({
    group: z.string(),
    items: z.array(z.string()).min(1),
    /** Lower sorts first. */
    order: z.number().default(100),
  }),
});

/** The /now page: one Markdown file with the date it was last true. */
const now = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/now' }),
  schema: z.object({
    updated: z.coerce.date(),
  }),
});

export const collections = { roles, education, projects, certifications, skills, now };
