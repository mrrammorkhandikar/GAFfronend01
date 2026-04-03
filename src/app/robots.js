const BASE_URL = 'https://www.guruakanksha.org';

/** Same host as robots/sitemap; logo for Google Search is `/logo.png` (see `layout.js` JSON-LD Organization.logo — robots.txt cannot declare title/brand images). */
export const siteLogoAbsoluteUrl = `${BASE_URL.replace(/\/$/, '')}/logo.png`;

export default function robots() {
  const baseUrl = BASE_URL.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

