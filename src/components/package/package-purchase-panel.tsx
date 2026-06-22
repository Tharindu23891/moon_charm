'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { QuantityStepper } from '@/components/quantity-stepper';
import { Badge } from '@/components/ui/badge';
import { formatLkr } from '@/lib/money';
import { applyDiscount } from '@/lib/pricing';

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
  const [qty, setQty] = useState(1);
  const effectivePrice = applyDiscount(pkg.price, pkg.discountPercent);

  return (
    <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.1em] text-muted-foreground uppercase">
            Package price
          </p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <p className="font-display text-[2rem] leading-none text-ink">
              {formatLkr(effectivePrice)}
            </p>
            {pkg.discountPercent ? (
              <span className="text-sm text-faint line-through">
                {formatLkr(pkg.price)}
              </span>
            ) : null}
          </div>
        </div>
        {pkg.discountPercent ? (
          <Badge variant="claret">Save {pkg.discountPercent}%</Badge>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">Quantity</span>
        <QuantityStepper value={qty} onChange={setQty} max={20} />
      </div>

      <div className="mt-5">
        <AddToCartButton
          fullWidth
          quantity={qty}
          label="Add package to cart"
          item={{
            itemType: 'package',
            refId: pkg.id,
            name: pkg.name,
            image: pkg.image,
            unitPrice: effectivePrice,
          }}
        />
      </div>

      <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted-foreground">
        <li className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4 shrink-0 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 13 4 4L19 7"
            />
          </svg>
          Assembled and wrapped as one gift
        </li>
        <li className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-4 w-4 shrink-0 text-primary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 13 4 4L19 7"
            />
          </svg>
          Delivered island-wide across Sri Lanka
        </li>
      </ul>
    </div>
  );
}
