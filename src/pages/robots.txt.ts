import type { APIRoute } from 'astro';

/**
 * Every crawler may index everything; the sitemap lists both languages.
 * Generated rather than kept in public/ so the sitemap URL follows `site` in
 * astro.config.mjs when the real domain lands.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('/sitemap-index.xml', site).href;
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
