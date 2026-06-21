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

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=70';

export function ProductCard({ product }: Readonly<{ product: ProductListItem }>) {
  const image = product.images?.[0] || FALLBACK_IMAGE;
  const soldOut = product.stock <= 0;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-surface">
        <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`} className="absolute inset-0">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        </Link>

        {product.category?.name ? (
          <span className="absolute left-3 top-3 rounded-full bg-bg/85 px-2.5 py-1 text-[0.7rem] font-medium text-ink backdrop-blur-sm">
            {product.category.name}
          </span>
        ) : null}

        {soldOut ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[0.7rem] font-semibold text-white">
            Sold out
          </span>
        ) : (
          <div className="absolute bottom-3 right-3 translate-y-1 opacity-0 transition-all duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
            <AddToCartButton
              variant="icon"
              item={{ itemType: 'product', refId: product.id, name: product.name, image, unitPrice: product.price }}
            />
          </div>
        )}
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <h3 className="font-display text-[1.15rem] leading-snug">
          <Link href={`/products/${product.id}`} className="transition-colors hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[0.95rem] font-semibold text-ink">{formatLkr(product.price)}</p>

        {product.shortDescription ? (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        ) : null}

        <p className="mt-auto pt-2 text-xs text-faint">
          {soldOut ? 'Currently unavailable' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </p>
      </div>
    </article>
  );
}
