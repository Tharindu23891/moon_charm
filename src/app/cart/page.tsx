'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { CartSummary } from '@/components/cart/cart-summary';
import { QuantityStepper } from '@/components/quantity-stepper';
import { MoonMark } from '@/components/moon-mark';
import { formatLkr } from '@/lib/money';
import { Button } from '@/components/ui/button';

const FALLBACK = 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=70';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clear, count } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mc-container py-12 md:py-16">
        <div className="h-9 w-40 animate-pulse rounded bg-surface" />
        <div className="mt-8 h-64 animate-pulse rounded-[var(--r-lg)] bg-surface" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mc-container py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <span className="h-12 w-12 text-primary"><MoonMark /></span>
          <h1 className="mt-5 font-display text-3xl">Your cart is empty</h1>
          <p className="mt-3 text-muted-foreground">
            Nothing chosen yet. Browse the shop, or start with a ready-made gift package.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild><Link href="/products">Shop gifts</Link></Button>
            <Button asChild variant="outline"><Link href="/packages">Browse packages</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mc-container py-12 md:py-16">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)]">Your cart</h1>
        <Button type="button" variant="ghost" size="sm" onClick={clear} className="text-muted-foreground hover:text-claret">
          Clear cart
        </Button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((it) => {
            const href = it.itemType === 'package' ? `/packages/${it.refId}` : `/products/${it.refId}`;
            return (
              <li key={it.refId} className="flex gap-4 py-5 sm:gap-5">
                <Link href={href} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[var(--r)] bg-surface sm:h-28 sm:w-24">
                  <Image src={it.image || FALLBACK} alt={it.name} fill sizes="96px" className="object-cover" />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={href} className="font-display text-lg leading-snug transition-colors hover:text-primary">
                        {it.name}
                      </Link>
                      <p className="mt-0.5 text-xs uppercase tracking-wide text-faint">
                        {it.itemType === 'package' ? 'Gift package' : 'Gift'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(it.refId)}
                      aria-label={`Remove ${it.name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-claret"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <QuantityStepper
                      value={it.quantity}
                      onChange={(v) => updateQuantity(it.refId, v)}
                      max={99}
                    />
                    <div className="text-right">
                      <p className="font-semibold text-ink">{formatLkr(it.unitPrice * it.quantity)}</p>
                      {it.quantity > 1 ? (
                        <p className="text-xs text-faint">{formatLkr(it.unitPrice)} each</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <CartSummary />
      </div>
    </div>
  );
}
