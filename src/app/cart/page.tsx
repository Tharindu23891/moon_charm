'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import { CartSummary } from '@/components/cart/cart-summary';
import { formatLkr } from '@/lib/money';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();

  return (
    <div className="mc-container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Cart</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Review items before checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="mc-btn-outline"
          disabled={items.length === 0}
        >
          Clear
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="mc-card md:col-span-2 overflow-hidden">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-600">
              Your cart is empty.{' '}
              <Link href="/products" className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-400">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((it) => (
                <div key={it.refId} className="flex gap-4 p-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl border bg-neutral-50">
                    <Image
                      src={it.image || 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=400&q=60'}
                      alt={it.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">{it.name}</div>
                        <div className="mt-1 text-xs text-neutral-600">
                          {it.itemType === 'product' ? 'Product' : 'Package'}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatLkr(it.unitPrice * it.quantity)}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.refId, it.quantity - 1)}
                          className="mc-btn-outline h-9 w-9 px-0"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={it.quantity}
                          min={1}
                          max={99}
                          onChange={(e) => updateQuantity(it.refId, Math.max(1, Number(e.target.value) || 1))}
                          className="mc-input h-9 w-16 px-2 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.refId, it.quantity + 1)}
                          className="mc-btn-outline h-9 w-9 px-0"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(it.refId)}
                        className="mc-btn-outline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/50 p-4 text-right text-sm text-zinc-600">
            Subtotal:{' '}
            <span className="font-semibold text-zinc-900">{formatLkr(subtotal)}</span>
          </div>
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
