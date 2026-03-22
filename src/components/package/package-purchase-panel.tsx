'use client';

import { AddToCartButton } from '@/components/cart/add-to-cart-button';

function discountedPrice(price: number, discountPercent?: number | null) {
  if (!discountPercent) return price;
  return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
}

export function PackagePurchasePanel({
  pkg,
}: {
  pkg: {
    id: string;
    name: string;
    image: string;
    price: number;
    discountPercent?: number | null;
  };
}) {
  const effectivePrice = discountedPrice(pkg.price, pkg.discountPercent);

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm font-medium">Add package</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600">Price</div>
        <div className="text-lg font-semibold">${effectivePrice.toFixed(2)}</div>
      </div>
      {pkg.discountPercent ? (
        <div className="mt-1 text-xs text-neutral-600">{pkg.discountPercent}% off</div>
      ) : null}
      <div className="mt-4">
        <AddToCartButton
          item={{
            itemType: 'package',
            refId: pkg.id,
            name: pkg.name,
            image: pkg.image,
            unitPrice: effectivePrice,
          }}
        />
      </div>
    </div>
  );
}
