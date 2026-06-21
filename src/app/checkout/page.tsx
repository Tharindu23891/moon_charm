'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCart } from '@/components/cart/cart-context';
import { formatLkr } from '@/lib/money';
import { cn } from '@/lib/cn';

const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone is required'),
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string(),
  city: z.string().min(1, 'City is required'),
  state: z.string(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  paymentMethod: z.enum(['cod', 'card', 'bank']),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  { value: 'cod', label: 'Cash on delivery', hint: 'Pay when it arrives' },
  { value: 'card', label: 'Card', hint: 'Pay securely by card' },
  { value: 'bank', label: 'Bank transfer', hint: 'We’ll send details' },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clear, count } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const defaultEmail = useMemo(() => session?.user?.email ?? '', [session?.user?.email]);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: session?.user?.name ?? '',
      email: defaultEmail,
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Sri Lanka',
      paymentMethod: 'cod',
    },
  });

  useEffect(() => {
    if (defaultEmail) form.setValue('email', defaultEmail, { shouldValidate: true });
    if (session?.user?.name) form.setValue('fullName', session.user.name, { shouldValidate: true });
  }, [defaultEmail, session?.user?.name, form]);

  const paymentMethod = form.watch('paymentMethod');

  async function onSubmit(values: CheckoutValues) {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const cartRes = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({ itemType: it.itemType, refId: it.refId, quantity: it.quantity })),
        }),
      });

      if (!cartRes.ok) {
        const msg = (await cartRes.json().catch(() => null))?.error ?? 'Failed to sync cart';
        toast.error(msg);
        return;
      }

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: values.paymentMethod,
          address: {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            line1: values.line1,
            line2: values.line2,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode,
            country: values.country,
          },
        }),
      });

      if (!orderRes.ok) {
        const msg = (await orderRes.json().catch(() => null))?.error ?? 'Failed to place order';
        toast.error(msg);
        return;
      }

      clear();
      toast.success('Order placed. Thank you.');
      router.push('/orders');
    } finally {
      setSubmitting(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-muted">Add a gift or two, then come back to check out.</p>
        <Link href="/products" className="mc-btn mt-6">Shop gifts</Link>
      </div>
    );
  }

  return (
    <div className="mc-container py-12 md:py-16">
      <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)]">Checkout</h1>
      <p className="mt-2 text-muted">Tell us where it’s going and how you’d like to pay.</p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <fieldset>
            <legend className="font-display text-xl">Your details</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={form.formState.errors.fullName?.message}>
                <input {...form.register('fullName')} className="mc-input" autoComplete="name" />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input {...form.register('email')} className="mc-input" autoComplete="email" inputMode="email" />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message} className="sm:col-span-2">
                <input {...form.register('phone')} className="mc-input" autoComplete="tel" inputMode="tel" />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Delivery address</legend>
            <div className="mt-5 grid gap-4">
              <Field label="Address line 1" error={form.formState.errors.line1?.message}>
                <input {...form.register('line1')} className="mc-input" autoComplete="address-line1" />
              </Field>
              <Field label="Address line 2 (optional)" error={form.formState.errors.line2?.message}>
                <input {...form.register('line2')} className="mc-input" autoComplete="address-line2" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" error={form.formState.errors.city?.message}>
                  <input {...form.register('city')} className="mc-input" autoComplete="address-level2" />
                </Field>
                <Field label="District / State" error={form.formState.errors.state?.message}>
                  <input {...form.register('state')} className="mc-input" autoComplete="address-level1" />
                </Field>
                <Field label="Postal code" error={form.formState.errors.postalCode?.message}>
                  <input {...form.register('postalCode')} className="mc-input" autoComplete="postal-code" />
                </Field>
                <Field label="Country" error={form.formState.errors.country?.message}>
                  <input {...form.register('country')} className="mc-input" autoComplete="country-name" />
                </Field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Payment</legend>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {paymentMethods.map((m) => {
                const selected = paymentMethod === m.value;
                return (
                  <label
                    key={m.value}
                    className={cn(
                      'cursor-pointer rounded-[var(--r)] border p-4 transition-colors',
                      selected ? 'border-primary bg-blush/50 ring-1 ring-primary' : 'border-line hover:border-line-strong',
                    )}
                  >
                    <input type="radio" value={m.value} {...form.register('paymentMethod')} className="sr-only" />
                    <span className="block text-sm font-semibold text-ink">{m.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{m.hint}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
            <h2 className="font-display text-xl">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((it) => (
                <li key={it.refId} className="flex items-start justify-between gap-3">
                  <span className="text-muted">
                    <span className="text-ink">{it.quantity}×</span> {it.name}
                  </span>
                  <span className="shrink-0 font-medium text-ink">{formatLkr(it.unitPrice * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="font-medium">Total · {count} {count === 1 ? 'item' : 'items'}</span>
              <span className="font-display text-xl text-ink">{formatLkr(subtotal)}</span>
            </div>

            <button type="submit" disabled={submitting} className="mc-btn mt-6 w-full">
              {submitting ? 'Placing order…' : 'Place order'}
            </button>
            <p className="mt-3 text-center text-xs text-faint">
              We’ll wrap it by hand and confirm delivery for your area.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mc-label">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}
