'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';
import { QuantityStepper } from '@/components/quantity-stepper';
import { Badge } from '@/components/ui/badge';
import { formatLkr } from '@/lib/money';

export function ProductPurchasePanel({
  product,
}: {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
}) {
  const [qty, setQty] = useState(1);
  const soldOut = product.stock <= 0;

  return (
    <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground">Price</p>
          <p className="mt-1 font-display text-[2rem] leading-none text-ink">{formatLkr(product.price)}</p>
        </div>
        <Badge variant="blush">
          {soldOut ? 'Sold out' : product.stock <= 5 ? `Only ${product.stock} left` : 'In stock'}
        </Badge>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">Quantity</span>
        <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, product.stock)} disabled={soldOut} />
      </div>

      <div className="mt-5">
        <AddToCartButton
          fullWidth
          quantity={qty}
          disabled={soldOut}
          label={soldOut ? 'Currently unavailable' : 'Add to cart'}
          item={{ itemType: 'product', refId: product.id, name: product.name, image: product.image, unitPrice: product.price }}
        />
      </div>

      <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-muted-foreground">
        <Reassurance>Wrapped by hand, with a gift note on request</Reassurance>
        <Reassurance>Delivered island-wide across Sri Lanka</Reassurance>
      </ul>
    </div>
  );
}

function Reassurance({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4 shrink-0 text-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
      {children}
    </li>
  );
}
