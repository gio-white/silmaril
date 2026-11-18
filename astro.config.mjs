// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real custom domain before launch. Needed for
  // absolute URLs in Open Graph tags, which is what social unfurls read.
  site: 'https://example.com',

  // No UI framework integration. Nothing on this site needs runtime component
  // state, and registering React emitted a 191kB orphan chunk into dist that
  // no page referenced. `pnpm astro add react` restores it in one command if a
  // genuinely interactive island ever appears.
  integrations: [
    // sitemap-index.xml with both languages; each URL lists its translations
    // as xhtml:link alternates. The 404 pages are left out.
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', it: 'it-IT' } },
      filter: (page) => !/\/404\/?$/.test(new URL(page).pathname),
    }),
  ],

  // English at the root, Italian under /it/. The default locale has no prefix,
  // so the English URLs that already exist never change.
  i18n: {
    locales: ['en', 'it'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },

  build: {
    // Small stylesheets get inlined into the HTML, saving a round trip on a
    // site whose CSS budget is ~12kB gzip.
    inlineStylesheets: 'auto',
  },

  image: {
    // AVIF first, WebP fallback. Both are generated at build time by sharp.
    responsiveStyles: true,
  },
});
