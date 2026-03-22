import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

export type ProductListItem = {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  images: string[];
  stock: number;
  category?: { name: string; slug: string } | null;
};

export function ProductCard({ product }: { product: ProductListItem }) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1520975958225-2a44e04e0a4b?auto=format&fit=crop&w=800&q=60';

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
        <Image src={image} alt={product.name} fill className="object-cover" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold leading-5">{product.name}</div>
            <div className="mt-1 text-xs text-neutral-600">{product.category?.name ?? '—'}</div>
          </div>
          <div className="text-sm font-semibold">${product.price.toFixed(2)}</div>
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs text-neutral-600">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
            >
              View
            </Link>
            <AddToCartButton
              disabled={product.stock <= 0}
              item={{
                itemType: 'product',
                refId: product.id,
                name: product.name,
                image,
                unitPrice: product.price,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
