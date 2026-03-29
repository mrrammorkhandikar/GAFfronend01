const BASE_URL = 'https://guruakanksha.org';

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
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }));
}

