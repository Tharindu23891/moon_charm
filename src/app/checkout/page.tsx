'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useCart } from '@/components/cart/cart-context';
import { formatLkr } from '@/lib/money';
import { cn } from '@/lib/cn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  const defaultEmail = useMemo(
    () => session?.user?.email ?? '',
    [session?.user?.email],
  );

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
    if (defaultEmail)
      form.setValue('email', defaultEmail, { shouldValidate: true });
    if (session?.user?.name)
      form.setValue('fullName', session.user.name, { shouldValidate: true });
  }, [defaultEmail, session?.user?.name, form]);

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
          items: items.map((it) => ({
            itemType: it.itemType,
            refId: it.refId,
            quantity: it.quantity,
          })),
        }),
      });

      if (!cartRes.ok) {
        const msg =
          (await cartRes.json().catch(() => null))?.error ??
          'Failed to sync cart';
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
        const msg =
          (await orderRes.json().catch(() => null))?.error ??
          'Failed to place order';
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
        <p className="mt-3 text-muted-foreground">
          Add a gift or two, then come back to check out.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Shop gifts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mc-container py-12 md:py-16">
      <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)]">Checkout</h1>
      <p className="mt-2 text-muted-foreground">
        Tell us where it’s going and how you’d like to pay.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-10">
          <fieldset>
            <legend className="font-display text-xl">Your details</legend>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                error={form.formState.errors.fullName?.message}
              >
                <Input {...form.register('fullName')} autoComplete="name" />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <Input
                  {...form.register('email')}
                  autoComplete="email"
                  inputMode="email"
                />
              </Field>
              <Field
                label="Phone"
                error={form.formState.errors.phone?.message}
                className="sm:col-span-2"
              >
                <Input
                  {...form.register('phone')}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Delivery address</legend>
            <div className="mt-5 grid gap-4">
              <Field
                label="Address line 1"
                error={form.formState.errors.line1?.message}
              >
                <Input
                  {...form.register('line1')}
                  autoComplete="address-line1"
                />
              </Field>
              <Field
                label="Address line 2 (optional)"
                error={form.formState.errors.line2?.message}
              >
                <Input
                  {...form.register('line2')}
                  autoComplete="address-line2"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" error={form.formState.errors.city?.message}>
                  <Input
                    {...form.register('city')}
                    autoComplete="address-level2"
                  />
                </Field>
                <Field
                  label="District / State"
                  error={form.formState.errors.state?.message}
                >
                  <Input
                    {...form.register('state')}
                    autoComplete="address-level1"
                  />
                </Field>
                <Field
                  label="Postal code"
                  error={form.formState.errors.postalCode?.message}
                >
                  <Input
                    {...form.register('postalCode')}
                    autoComplete="postal-code"
                  />
                </Field>
                <Field
                  label="Country"
                  error={form.formState.errors.country?.message}
                >
                  <Input
                    {...form.register('country')}
                    autoComplete="country-name"
                  />
                </Field>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Payment</legend>
            <Controller
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="mt-5 grid gap-3 sm:grid-cols-3"
                >
                  {paymentMethods.map((m) => (
                    <Label
                      key={m.value}
                      htmlFor={`pay-${m.value}`}
                      className="flex cursor-pointer flex-col items-start gap-1.5 rounded-[var(--r)] border border-line p-4 transition-colors hover:border-line-strong has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-blush/50 has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-primary"
                    >
                      <span className="flex items-center gap-2">
                        <RadioGroupItem id={`pay-${m.value}`} value={m.value} />
                        <span className="text-sm font-semibold text-ink">
                          {m.label}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {m.hint}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              )}
            />
          </fieldset>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
            <h2 className="font-display text-xl">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {items.map((it) => (
                <li
                  key={it.refId}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="text-muted-foreground">
                    <span className="text-ink">{it.quantity}×</span> {it.name}
                  </span>
                  <span className="shrink-0 font-medium text-ink">
                    {formatLkr(it.unitPrice * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="font-medium">
                Total · {count} {count === 1 ? 'item' : 'items'}
              </span>
              <span className="font-display text-xl text-ink">
                {formatLkr(subtotal)}
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-6 w-full"
            >
              {submitting ? 'Placing order…' : 'Place order'}
            </Button>
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
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : null}
    </label>
  );
}
