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
    /** Each should carry a number. Bullets without one are what makes a data
     *  engineering CV forgettable. */
    highlights: z.array(z.string()).min(1),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/education' }),
  schema: z.object({
    institution: z.string(),
    qualification: z.string(),
    field: z.string(),
    start: yearOnly,
    end: yearOnly,
    note: z.string().optional(),
  }),
});

const projects = defineCollection({
  // Markdown so a project can carry a full case study in its body. Projects
  // without one simply have an empty body and get no detail page.
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
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

export const collections = { roles, education, projects, certifications, skills };
