import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

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
    <div className="rounded-2xl border bg-white p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-50">
        <Image src={image} alt={pkg.name} fill className="object-cover" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold leading-5">{pkg.name}</div>
          <div className="text-right">
            <div className="text-sm font-semibold">${effectivePrice.toFixed(2)}</div>
            {pkg.discountPercent ? (
              <div className="text-xs text-neutral-600">{pkg.discountPercent}% off</div>
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
          <Link
            href={`/packages/${pkg.id}`}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
          >
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
  );
}
