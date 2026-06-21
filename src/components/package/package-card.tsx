import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { formatLkr } from '@/lib/money';
import { applyDiscount } from '@/lib/pricing';

export type PackageListItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  discountPercent?: number | null;
  items: { name?: string | null; quantity: number }[];
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=70';

export function PackageCard({ pkg }: { pkg: PackageListItem }) {
  const image = pkg.image || FALLBACK_IMAGE;
  const effectivePrice = applyDiscount(pkg.price, pkg.discountPercent);
  const includes = pkg.items
    .slice(0, 3)
    .map((it) => `${it.quantity}× ${it.name ?? 'gift'}`)
    .join(' · ');

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-surface">
        <Link href={`/packages/${pkg.id}`} aria-label={`View ${pkg.name}`} className="absolute inset-0">
          <Image
            src={image}
            alt={pkg.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        </Link>

        <span className="absolute left-3 top-3 mc-pill-blush rounded-full px-2.5 py-1 text-[0.7rem] font-semibold">
          Gift package
        </span>

        {pkg.discountPercent ? (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[0.7rem] font-semibold text-white">
            Save {pkg.discountPercent}%
          </span>
        ) : null}

        <div className="absolute bottom-3 right-3 translate-y-1 opacity-0 transition-all duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100">
          <AddToCartButton
            variant="icon"
            item={{ itemType: 'package', refId: pkg.id, name: pkg.name, image, unitPrice: effectivePrice }}
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-1 flex-col">
        <h3 className="font-display text-[1.15rem] leading-snug">
          <Link href={`/packages/${pkg.id}`} className="transition-colors hover:text-primary">
            {pkg.name}
          </Link>
        </h3>
        <span className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-[0.95rem] font-semibold text-ink">{formatLkr(effectivePrice)}</span>
          {pkg.discountPercent ? (
            <span className="text-xs text-faint line-through">{formatLkr(pkg.price)}</span>
          ) : null}
        </span>

        <p className="mt-1.5 line-clamp-2 text-sm text-muted">
          {includes ? <>Includes {includes}</> : 'A curated bundle, ready to gift.'}
        </p>
      </div>
    </article>
  );
}
