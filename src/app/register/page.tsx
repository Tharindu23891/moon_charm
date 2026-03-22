'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  async function onSubmit(values: RegisterValues) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Registration failed';
      toast.error(msg);
      return;
    }

    const login = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!login || login.error) {
      toast.success('Account created');
      router.push('/login');
      return;
    }

    toast.success('Welcome');
    router.push('/');
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-6">
        <h1 className="text-xl font-semibold tracking-tight">Register</h1>
        <p className="mt-1 text-sm text-neutral-600">Create your account.</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 grid gap-3">
          <Field label="Name" error={form.formState.errors.name?.message}>
            <input
              {...form.register('name')}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

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
            {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 text-sm text-neutral-600">
          Already have an account?{' '}
          <Link href="/login" className="text-neutral-900 underline">
            Login
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
