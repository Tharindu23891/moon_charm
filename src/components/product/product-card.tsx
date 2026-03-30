import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { formatLkr } from '@/lib/money';

export type ProductListItem = {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  images: string[];
  stock: number;
  category?: { name: string; slug: string } | null;
};

export function ProductCard({ product }: Readonly<{ product: ProductListItem }>) {
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1520975958225-2a44e04e0a4b?auto=format&fit=crop&w=800&q=60';

  return (
    <div className="mc-card mc-card-hover group p-4">
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-white/50">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.name}`}
          className="absolute inset-0"
        >
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-3 top-3">
          <span className="mc-pill border-fuchsia-200/60 bg-white/75 text-fuchsia-700">
            {product.category?.name ?? 'Gift'}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold leading-5 text-neutral-900">
              {product.name}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <Stars />
              <span className="text-xs text-neutral-600">Top rated</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold">
              <span className="mc-text-gradient">{formatLkr(product.price)}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2">{product.shortDescription}</p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs text-neutral-600">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>
          <div className="flex items-center gap-2">
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

function Stars() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5 text-amber-400"
          fill="currentColor"
        >
          <path d="M10 15.27l-5.18 2.73 1-5.81L1.64 7.5l5.84-.85L10 1.35l2.52 5.3 5.84.85-4.18 4.69 1 5.81L10 15.27z" />
        </svg>
      ))}
    </span>
  );
}
