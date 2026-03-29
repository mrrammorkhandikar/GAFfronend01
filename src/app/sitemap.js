const BASE_URL = 'https://guruakanksha.org';
const LAST_MODIFIED = new Date('2026-03-29T00:00:00.000Z');

export const dynamic = 'force-static';

export default function sitemap() {
  const baseUrl = BASE_URL.replace(/\/$/, '');

  const staticRoutes = [
    '',
    '/about',
    '/campaigns',
    '/events',
    '/partners',
    '/careers',
    '/donate',
    '/contact',
  ];

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}

