'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import { formatLkr } from '@/lib/money';
import { cn } from '@/lib/cn';

export function CartSummary() {
  const { subtotal, count } = useCart();
  const empty = count === 0;

  return (
    <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6 lg:sticky lg:top-28">
      <h2 className="font-display text-xl">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal · {count} {count === 1 ? 'item' : 'items'}</dt>
          <dd className="font-medium text-ink">{formatLkr(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Delivery</dt>
          <dd className="text-muted">Confirmed at checkout</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="font-medium">Total</span>
        <span className="font-display text-xl text-ink">{formatLkr(subtotal)}</span>
      </div>

      <Link
        href="/checkout"
        aria-disabled={empty}
        className={cn('mc-btn mt-6 w-full', empty && 'pointer-events-none opacity-50')}
      >
        Proceed to checkout
      </Link>
      <Link href="/products" className="mt-3 block text-center text-sm text-muted transition-colors hover:text-ink">
        Continue shopping
      </Link>
    </div>
  );
}
