import type { MetadataRoute } from 'next';
import { absoluteUrl, siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Account, transaction, and admin surfaces carry no SEO value and may
        // expose personal data, so keep them out of the index entirely.
        disallow: [
          '/admin',
          '/api',
          '/cart',
          '/checkout',
          '/login',
          '/register',
          '/profile',
          '/orders',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  };
}
