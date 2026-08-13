// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real custom domain before launch. Needed for
  // absolute URLs in Open Graph tags, which is what social unfurls read.
  site: 'https://example.com',

  integrations: [react()],

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
