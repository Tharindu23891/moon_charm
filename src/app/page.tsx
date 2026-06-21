import Image from 'next/image';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { GiftPackage } from '@/models/GiftPackage';
import { ProductCard } from '@/components/product/product-card';
import { PackageCard } from '@/components/package/package-card';

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let featuredPackages: any[] = [];
  let categories: any[] = [];

  try {
    await connectToDatabase();

    [featuredProducts, featuredPackages, categories] = await Promise.all([
      Product.find({ isFeatured: true }).sort({ popularity: -1 }).limit(6).populate('categoryId').lean(),
      GiftPackage.find({ isFeatured: true }).sort({ popularity: -1 }).limit(6).populate('items.productId').lean(),
      Category.find({}).sort({ name: 1 }).limit(8).lean(),
    ]);
  } catch (error) {
    console.error('Failed to load homepage data from MongoDB', error);
  }

  return (
    <div className="mc-container py-10">

      <section className="h-[65vh] relative max-w-7xl flex gap-8 justify-center flex-col">



<h1 className="text-9xl z-10 font-semibold tracking-tight instrument-serif-regular">
 The Moon Charm
</h1>

<p className="text-lg z-10 max-w-prose text-neutral-600">
  Curated gifts and bundles for birthdays, anniversaries, weddings,
  corporate events, and more — crafted to delight.
</p>


<div className="flex items-center z-10 gap-4"><Link href="/products" className="mc-btn px-6 py-2.5">
  Shop products
</Link></div>

    <Image
      src="https://images.unsplash.com/photo-1524758631624-e2822e304c36"
      alt="The Moon Charm"
      width={1600}
      height={750}
      priority
      sizes="100vw"
      className="w-full h-full scale-[2] max-h-[750px] object-cover absolute -top-65 -z-10 opacity-30"
    />



      </section>

{/* -------------------------------------------------------------------------------- */}

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Featured gift items</h2>
            <p className="mt-1 text-sm text-neutral-600">Popular picks, crafted to impress.</p>
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
                  ? { name: p.categoryId.name, slug: p.categoryId.slug }
                  : null,
              }}
            />
          ))}
          {featuredProducts.length === 0 ? (
            <div className="mc-card p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
              No featured products yet. Run the seed script to populate sample items.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-white/40 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Featured packages</h2>
            <p className="mt-1 text-sm text-neutral-600">Curated bundles with extra value.</p>
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
            <div className="mc-card p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-3">
              No featured packages yet. Run the seed script to populate sample bundles.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Categories</h2>
            <p className="mt-1 text-sm text-neutral-600">Shop by occasion — find the perfect match.</p>
          </div>
          <Link href="/categories" className="text-sm text-neutral-700 hover:text-neutral-900">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(categories as any[]).map((c, idx) => (
            <Link
              key={c._id.toString()}
              href={`/products?category=${encodeURIComponent(c.slug)}`}
              className="mc-card mc-card-hover p-5"
            >
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-violet-200/80 via-fuchsia-200/80 to-rose-200/80 shadow-sm shadow-violet-200/50">
                  <CategoryIcon idx={idx} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{c.name}</div>
                  <div className="mt-1 text-xs text-neutral-600">Browse products</div>
                </div>
              </div>
            </Link>
          ))}
          {categories.length === 0 ? (
            <div className="mc-card p-6 text-sm text-neutral-600 sm:col-span-2 lg:col-span-4">
              No categories yet. Run the seed script to add sample categories.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-14 rounded-3xl bg-white/40 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Testimonials</h2>
            <p className="mt-1 text-sm text-neutral-600">Loved by customers who gift with style.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            {
              quote: 'Beautiful packaging and fast delivery — it felt truly premium.',
              name: 'Ayesha K.',
              initials: 'AK',
            },
            {
              quote: 'Great selection of gifts for every occasion. The bundles are perfect.',
              name: 'Mark L.',
              initials: 'ML',
            },
            {
              quote: 'Amazing quality and presentation. I’m buying again for sure.',
              name: 'Priya S.',
              initials: 'PS',
            },
          ].map((t) => (
            <div
              key={t.name}
              className="mc-card mc-card-hover bg-linear-to-br from-white/75 via-white/65 to-violet-50/70 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <svg key={star} viewBox="0 0 20 20" className="h-4 w-4 text-amber-400" fill="currentColor">
                      <path d="M10 15.27l-5.18 2.73 1-5.81L1.64 7.5l5.84-.85L10 1.35l2.52 5.3 5.84.85-4.18 4.69 1 5.81L10 15.27z" />
                    </svg>
                  ))}
                </div>
                <span className="mc-pill border-violet-200/60 bg-white/70 text-violet-700">Verified</span>
              </div>

              <div className="mt-4 text-sm text-neutral-700">“{t.quote}”</div>

              <div className="mt-5 flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-300/70 via-fuchsia-300/70 to-rose-300/70 text-sm font-extrabold text-neutral-900 shadow-sm shadow-violet-200/50">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-600">The Moon Charm customer</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CategoryIcon({ idx }: Readonly<{ idx: number }>) {
  const icon = idx % 4;
  if (icon === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-violet-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h20l-1 5H3L2 7z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V7" />
      </svg>
    );
  }
  if (icon === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-fuchsia-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-4.35-7-10a4 4 0 017-2 4 4 0 017 2c0 5.65-7 10-7 10z" />
      </svg>
    );
  }
  if (icon === 2) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-rose-700">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7l3-7z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-purple-700">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0" />
    </svg>
  );
}
