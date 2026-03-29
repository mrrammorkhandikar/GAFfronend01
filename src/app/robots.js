const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://guruakanksha.org';

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

