import Image from 'next/image';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { ProductPurchasePanel } from '@/components/product/product-purchase-panel';
import { ProductCard } from '@/components/product/product-card';

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectToDatabase();
  const product = await Product.findById(id).populate('categoryId').lean();

  if (!product) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-8 text-sm text-neutral-600">
          Product not found.
        </div>
      </div>
    );
  }

  const images: string[] = (product as any).images ?? [];
  const heroImage =
    images[0] ||
    'https://images.unsplash.com/photo-1520975958225-2a44e04e0a4b?auto=format&fit=crop&w=1200&q=60';

  const categorySlug = (product as any).categoryId?.slug as string | undefined;

  const related = categorySlug
    ? await Product.find({
        _id: { $ne: (product as any)._id },
        categoryId: (product as any).categoryId?._id,
      })
        .sort({ popularity: -1 })
        .limit(6)
        .populate('categoryId')
        .lean()
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="text-sm text-neutral-600">
        <Link href="/products" className="hover:text-neutral-900">
          Products
        </Link>
        <span> / </span>
        <span className="text-neutral-900">{(product as any).name}</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-neutral-50">
            <Image src={heroImage} alt={(product as any).name} fill className="object-cover" />
          </div>

          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-xl border bg-neutral-50">
                  <Image src={src} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {(product as any).name}
            </h1>
            <div className="mt-1 text-sm text-neutral-600">
              Category: {(product as any).categoryId?.name ?? '—'}
            </div>
          </div>

          <p className="text-sm text-neutral-700">{(product as any).description}</p>

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

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Related products</h2>
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
                category: p.categoryId ? { name: (p as any).categoryId.name, slug: (p as any).categoryId.slug } : null,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
