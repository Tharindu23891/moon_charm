import Link from 'next/link';
import { Suspense } from 'react';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ProductCard } from '@/components/product/product-card';
import { ProductImageGallery } from '@/components/product/product-image-gallery';

export default async function ProductDetailsPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  await connectToDatabase();
  const product = await Product.findById(id)
    .select('name description images price stock categoryId')
    .populate({ path: 'categoryId', select: 'name slug' })
    .lean();

  if (!product) {
    return (
      <div className="mc-container py-10">
        <div className="mc-card p-8 text-sm text-zinc-600">
          Product not found.
        </div>
      </div>
    );
  }

  const images: string[] = (product as any).images ?? [];
  const heroImage =
    images[0] ||
    'https://images.unsplash.com/photo-1520975958225-2a44e04e0a4b?auto=format&fit=crop&w=1200&q=60';

  const categoryId = (product as any).categoryId?._id?.toString() as string | undefined;

  return (
    <div className="mc-container py-10">
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
        <Link href="/products" className="mc-pill hover:bg-white">
          Products
        </Link>
        <span className="text-zinc-400">/</span>
        <span className="font-medium text-zinc-900">{(product as any).name}</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <ProductImageGallery
            images={images}
            productName={(product as any).name}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              <span className="mc-text-gradient">{(product as any).name}</span>
            </h1>
            <div className="mt-2 text-sm text-zinc-600">
              Category: {(product as any).categoryId?.name ?? '—'}
            </div>
          </div>

          <p className="text-sm text-zinc-700">{(product as any).description}</p>

          <ProductPurchasePanel
            product={{
              id: (product as any)._id.toString(),
              name: (product as any).name,
              image: heroImage,
              price: (product as any).price,
              stock: (product as any).stock,
            }}
          />
        </div>
      </div>

      {categoryId ? (
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProductsSection
            productId={(product as any)._id.toString()}
            categoryId={categoryId}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

async function RelatedProductsSection({
  productId,
  categoryId,
}: Readonly<{
  productId: string;
  categoryId: string;
}>) {
  const related = await Product.find({
    _id: { $ne: productId },
    categoryId,
  })
    .select('name shortDescription price images stock categoryId')
    .sort({ popularity: -1 })
    .limit(6)
    .populate({ path: 'categoryId', select: 'name slug' })
    .lean();

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Related products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(related as any[]).map((p) => (
          <ProductCard
            key={p._id.toString()}
            product={{
              id: p._id.toString(),
              name: p.name,
              shortDescription: p.shortDescription,
              price: p.price,
              images: p.images ?? [],
              stock: p.stock,
              category: p.categoryId ? { name: p.categoryId.name, slug: p.categoryId.slug } : null,
            }}
          />
        ))}
      </div>
    </section>
  );
}

function RelatedProductsSkeleton() {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Related products</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="mc-card p-4">
            <div className="h-40 animate-pulse rounded-xl bg-zinc-200/70" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-200/70" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-zinc-200/60" />
          </div>
        ))}
      </div>
    </section>
  );
}
