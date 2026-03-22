'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCart } from '@/components/cart/cart-context';

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

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);

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
      country: 'United States',
      paymentMethod: 'cod',
    },
  });

  useEffect(() => {
    if (defaultEmail) {
      form.setValue('email', defaultEmail, { shouldValidate: true });
    }
    if (session?.user?.name) {
      form.setValue('fullName', session.user.name, { shouldValidate: true });
    }
  }, [defaultEmail, session?.user?.name, form]);

  async function onSubmit(values: CheckoutValues) {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      // Sync local cart -> server cart
      const cartRes = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            itemType: it.itemType,
            refId: it.refId,
            quantity: it.quantity,
          })),
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
      toast.success('Order placed');
      router.push('/orders');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Enter delivery details and confirm your order.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="md:col-span-2 rounded-2xl border bg-white p-5"
        >
          <div className="text-sm font-medium">Customer details</div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input
                {...form.register('fullName')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>

            <Field label="Email" error={form.formState.errors.email?.message}>
              <input
                {...form.register('email')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>

            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input
                {...form.register('phone')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <div className="mt-6 text-sm font-medium">Delivery address</div>
          <div className="mt-4 grid gap-3">
            <Field label="Address line 1" error={form.formState.errors.line1?.message}>
              <input
                {...form.register('line1')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Address line 2" error={form.formState.errors.line2?.message}>
              <input
                {...form.register('line2')}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="City" error={form.formState.errors.city?.message}>
                <input
                  {...form.register('city')}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </Field>
              <Field label="State" error={form.formState.errors.state?.message}>
                <input
                  {...form.register('state')}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Postal code" error={form.formState.errors.postalCode?.message}>
                <input
                  {...form.register('postalCode')}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Country" error={form.formState.errors.country?.message}>
                <input
                  {...form.register('country')}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 text-sm font-medium">Payment method</div>
          <div className="mt-4">
            <select
              {...form.register('paymentMethod')}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="cod">Cash on delivery</option>
              <option value="card">Card</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </form>

        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm font-medium">Order summary</div>
          <div className="mt-3 space-y-2 text-sm text-neutral-700">
            {items.map((it) => (
              <div key={it.refId} className="flex items-center justify-between gap-3">
                <span className="truncate">{it.quantity}× {it.name}</span>
                <span className="font-medium">${(it.unitPrice * it.quantity).toFixed(2)}</span>
              </div>
            ))}
            {items.length === 0 ? <div className="text-neutral-600">—</div> : null}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-neutral-600">Total</span>
            <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-neutral-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
