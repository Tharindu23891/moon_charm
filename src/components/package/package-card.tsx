import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { formatLkr } from '@/lib/money';

export type PackageListItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  discountPercent?: number | null;
  items: { name?: string | null; quantity: number }[];
};

function discountedPrice(price: number, discountPercent?: number | null) {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

export function PackageCard({ pkg }: { pkg: PackageListItem }) {
  const image =
    pkg.image ||
    'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=800&q=60';

  const effectivePrice = discountedPrice(pkg.price, pkg.discountPercent);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-violet-200/70 via-fuchsia-200/70 to-rose-200/70 p-[1px]">
      <div className="mc-card mc-card-hover group relative p-4">
        {pkg.discountPercent ? (
          <div className="absolute left-4 top-4 z-10 overflow-hidden rounded-xl">
            <div className="bg-gradient-to-r from-rose-500 to-fuchsia-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-md shadow-rose-200/40">
              {pkg.discountPercent}% OFF
            </div>
          </div>
        ) : null}

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/50">
          <Image
            src={image}
            alt={pkg.name}
            fill
            sizes="400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-semibold leading-5 text-neutral-900">{pkg.name}</div>
            <div className="text-right">
              <div className="text-sm font-extrabold">
                <span className="mc-text-gradient">{formatLkr(effectivePrice)}</span>
              </div>
              {pkg.discountPercent ? (
                <div className="text-xs text-neutral-600">Was {formatLkr(pkg.price)}</div>
              ) : null}
            </div>
          </div>

          <div className="text-sm text-neutral-600">
            Includes:{' '}
            {pkg.items.length > 0
              ? pkg.items
                  .slice(0, 3)
                  .map((it) => `${it.quantity}× ${it.name ?? 'Item'}`)
                  .join(', ')
              : '—'}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Link href={`/packages/${pkg.id}`} className="mc-btn-outline">
              View
            </Link>
            <AddToCartButton
              item={{
                itemType: 'package',
                refId: pkg.id,
                name: pkg.name,
                image,
                unitPrice: effectivePrice,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
