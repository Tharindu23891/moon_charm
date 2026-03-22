'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';

export function CartSummary() {
  const { subtotal } = useCart();

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm font-medium">Order summary</div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-neutral-600">Subtotal</span>
        <span className="font-medium">${subtotal.toFixed(2)}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-neutral-600">Total</span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
