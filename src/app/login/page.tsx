'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!res || res.error) {
      toast.error('Invalid email or password');
      return;
    }

    toast.success('Welcome back');
    router.push(next);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 text-sm text-neutral-600">Access your account.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-3">
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input
              type="email"
              {...form.register('email')}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Password" error={form.formState.errors.password?.message}>
            <input
              type="password"
              {...form.register('password')}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300"
          >
            {form.formState.isSubmitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-neutral-600">
          Don’t have an account?{' '}
          <Link href="/register" className="text-neutral-900 underline">
            Register
          </Link>
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
