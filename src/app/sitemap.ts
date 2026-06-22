import type { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { GiftPackage } from '@/models/GiftPackage';
import { absoluteUrl } from '@/lib/site';

// Refresh the sitemap hourly so newly added products/packages appear without a
// redeploy, while still serving cached output to crawlers most of the time.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/products'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/packages'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/categories'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    await connectToDatabase();

    const [products, packages] = await Promise.all([
      Product.find({})
        .select('_id updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5000)
        .lean(),
      GiftPackage.find({})
        .select('_id updatedAt')
        .sort({ updatedAt: -1 })
        .limit(5000)
        .lean(),
    ]);

    const productRoutes: MetadataRoute.Sitemap = (products as any[]).map(
      (p) => ({
        url: absoluteUrl(`/products/${p._id.toString()}`),
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }),
    );

    const packageRoutes: MetadataRoute.Sitemap = (packages as any[]).map(
      (p) => ({
        url: absoluteUrl(`/packages/${p._id.toString()}`),
        lastModified: p.updatedAt ?? now,
        changeFrequency: 'weekly',
        priority: 0.8,
      }),
    );

    return [...staticRoutes, ...productRoutes, ...packageRoutes];
  } catch (error) {
    // If the catalog is briefly unavailable, still serve the static routes so
    // crawlers get a valid sitemap rather than a 500.
    console.error('Failed to build dynamic sitemap entries', error);
    return staticRoutes;
  }
}
