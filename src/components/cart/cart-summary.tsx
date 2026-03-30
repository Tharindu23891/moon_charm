'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import { formatLkr } from '@/lib/money';

export function CartSummary() {
  const { subtotal } = useCart();

  return (
    <div className="mc-card mc-card-hover p-5">
      <div className="text-sm font-semibold">Order summary</div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-neutral-600">Subtotal</span>
        <span className="font-medium">{formatLkr(subtotal)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-neutral-600">Total</span>
        <span className="font-semibold">
          <span className="mc-text-gradient">{formatLkr(subtotal)}</span>
        </span>
      </div>
      <Link
        href="/checkout"
        className="mc-btn mt-5 w-full"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
