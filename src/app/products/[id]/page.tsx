import Link from 'next/link';
import { Suspense } from 'react';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ProductCard } from '@/components/product/product-card';
import { ProductImageGallery } from '@/components/product/product-image-gallery';
import { Breadcrumb } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function ProductDetailsPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;

  await connectToDatabase();
  const product = await Product.findById(id)
    .select('name description shortDescription images price stock categoryId')
    .populate({ path: 'categoryId', select: 'name slug' })
    .lean();

  if (!product) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">We can’t find that gift</h1>
        <p className="mt-3 text-muted-foreground">It may have sold out or been moved.</p>
        <Button asChild className="mt-6"><Link href="/products">Back to the shop</Link></Button>
      </div>
    );
  }

  const p = product as any;
  const images: string[] = p.images ?? [];
  const heroImage = images[0] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=70';
  const categoryId = p.categoryId?._id?.toString() as string | undefined;

  return (
    <div className="mc-container py-8 md:py-12">
      <Breadcrumb
        items={[{ href: '/', label: 'Home' }, { href: '/products', label: 'Shop' }, { label: p.name }]}
      />

      <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductImageGallery images={images} productName={p.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          {p.categoryId?.name ? (
            <Badge asChild variant="outline" className="transition-colors hover:border-line-strong">
              <Link href={`/products?category=${encodeURIComponent(p.categoryId.slug)}`}>{p.categoryId.name}</Link>
            </Badge>
          ) : null}

          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05]">{p.name}</h1>

          {p.shortDescription ? (
            <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground">{p.shortDescription}</p>
          ) : null}

          {p.description ? (
            <p className="mc-prose mt-4 leading-relaxed text-ink/80">{p.description}</p>
          ) : null}

          <div className="mt-7">
            <ProductPurchasePanel
              product={{ id: p._id.toString(), name: p.name, image: heroImage, price: p.price, stock: p.stock }}
            />
          </div>
        </div>
      </div>

      {categoryId ? (
        <Suspense fallback={<RelatedSkeleton />}>
          <RelatedProductsSection productId={p._id.toString()} categoryId={categoryId} />
        </Suspense>
      ) : null}
    </div>
  );
}

async function RelatedProductsSection({ productId, categoryId }: Readonly<{ productId: string; categoryId: string }>) {
  const related = await Product.find({ _id: { $ne: productId }, categoryId })
    .select('name shortDescription price images stock categoryId')
    .sort({ popularity: -1 })
    .limit(4)
    .populate({ path: 'categoryId', select: 'name slug' })
    .lean();

  if (related.length === 0) return null;

  return (
    <section className="mt-20 border-t border-line pt-12">
      <h2 className="font-display text-2xl">You might also like</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
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

function RelatedSkeleton() {
  return (
    <section className="mt-20 border-t border-line pt-12">
      <h2 className="font-display text-2xl">You might also like</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="aspect-[4/5] animate-pulse rounded-[var(--r-lg)] bg-surface" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-surface" />
            <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-surface" />
          </div>
        ))}
      </div>
    </section>
  );
}
