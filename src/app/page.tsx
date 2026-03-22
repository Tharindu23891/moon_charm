import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { GiftPackage } from '@/models/GiftPackage';
import { ProductCard } from '@/components/product/product-card';
import { PackageCard } from '@/components/package/package-card';

export default async function HomePage() {
  await connectToDatabase();

  const [featuredProducts, featuredPackages, categories, offers] = await Promise.all([
    Product.find({ isFeatured: true }).sort({ popularity: -1 }).limit(6).populate('categoryId').lean(),
    GiftPackage.find({ isFeatured: true }).sort({ popularity: -1 }).limit(6).populate('items.productId').lean(),
    Category.find({}).sort({ name: 1 }).limit(8).lean(),
    GiftPackage.find({ discountPercent: { $gt: 0 } })
      .sort({ discountPercent: -1 })
      .limit(3)
      .populate('items.productId')
      .lean(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="rounded-2xl border bg-white p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Thoughtful gifts, beautifully packaged.
            </h1>
            <p className="text-base text-neutral-600 md:text-lg">
              Shop gift items and curated bundles for birthdays, anniversaries,
              weddings, corporate events, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Browse Products
              </Link>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
              >
                View Packages
              </Link>
            </div>
          </div>
          <div className="rounded-xl bg-linear-to-br from-neutral-50 to-neutral-100 p-10 text-neutral-700">
            <div className="text-sm font-medium">Special offers</div>
            <div className="mt-3 grid gap-2 text-sm text-neutral-600">
              {offers.length === 0 ? (
                <div>Seed data will populate discounts here.</div>
              ) : (
                (offers as any[]).map((o) => (
                  <div key={o._id.toString()} className="flex items-center justify-between">
                    <span className="truncate">{o.name}</span>
                    <span className="font-medium">{o.discountPercent}% off</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Featured gift items</h2>
            <p className="mt-1 text-sm text-neutral-600">Popular products customers love.</p>
          </div>
          <Link href="/products" className="text-sm text-neutral-700 hover:text-neutral-900">
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(featuredProducts as any[]).map((p) => (
            <ProductCard
              key={p._id.toString()}
              product={{
                id: p._id.toString(),
                name: p.name,
                shortDescription: p.shortDescription,
                price: p.price,
                images: p.images ?? [],
                stock: p.stock,
                category: p.categoryId
                  ? { name: (p as any).categoryId.name, slug: (p as any).categoryId.slug }
                  : null,
              }}
            />
          ))}
          {featuredProducts.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
              No featured products yet. Run the seed script to populate sample items.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Featured packages</h2>
            <p className="mt-1 text-sm text-neutral-600">Bundles with great value.</p>
          </div>
          <Link href="/packages" className="text-sm text-neutral-700 hover:text-neutral-900">
            View all
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(featuredPackages as any[]).map((p) => (
            <PackageCard
              key={p._id.toString()}
              pkg={{
                id: p._id.toString(),
                name: p.name,
                image: p.image,
                price: p.price,
                discountPercent: p.discountPercent ?? null,
                items: (p.items ?? []).map((it: any) => ({
                  name: it.productId?.name ?? null,
                  quantity: it.quantity,
                })),
              }}
            />
          ))}
          {featuredPackages.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
              No featured packages yet. Run the seed script to populate sample bundles.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Categories</h2>
            <p className="mt-1 text-sm text-neutral-600">Shop by occasion.</p>
          </div>
          <Link href="/categories" className="text-sm text-neutral-700 hover:text-neutral-900">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(categories as any[]).map((c) => (
            <Link
              key={c._id.toString()}
              href={`/products?category=${encodeURIComponent(c.slug)}`}
              className="rounded-2xl border bg-white p-5 hover:bg-neutral-50"
            >
              <div className="text-sm font-medium">{c.name}</div>
              <div className="mt-1 text-xs text-neutral-600">Browse products</div>
            </Link>
          ))}
          {categories.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-4">
              No categories yet. Run the seed script to add sample categories.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-white p-8">
        <h2 className="text-lg font-semibold tracking-tight">Testimonials</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              quote: 'Beautiful packaging and fast delivery.',
              name: 'Ayesha K.',
            },
            {
              quote: 'Great selection of gifts for every occasion.',
              name: 'Mark L.',
            },
            {
              quote: 'The bundles are perfect and priced well.',
              name: 'Priya S.',
            },
          ].map((t) => (
            <div key={t.name} className="rounded-2xl border bg-neutral-50 p-5">
              <div className="text-sm text-neutral-700">“{t.quote}”</div>
              <div className="mt-3 text-xs font-medium text-neutral-900">{t.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
