'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/cart-context';
import { CartSummary } from '@/components/cart/cart-summary';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Review items before checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
          disabled={items.length === 0}
        >
          Clear
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border bg-white">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-600">
              Your cart is empty.{' '}
              <Link href="/products" className="text-neutral-900 underline">
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
                        ${(it.unitPrice * it.quantity).toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.refId, it.quantity - 1)}
                          className="h-9 w-9 rounded-lg border hover:bg-neutral-50"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={it.quantity}
                          min={1}
                          max={99}
                          onChange={(e) => updateQuantity(it.refId, Math.max(1, Number(e.target.value) || 1))}
                          className="h-9 w-16 rounded-lg border px-2 text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.refId, it.quantity + 1)}
                          className="h-9 w-9 rounded-lg border hover:bg-neutral-50"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(it.refId)}
                        className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t p-4 text-right text-sm text-neutral-600">
            Subtotal: <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
          </div>
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
