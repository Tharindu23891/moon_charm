'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProviders, signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { BrandName } from '@/components/brand-name';

const loginSchema = z.object({
  email: z.email({ message: 'Valid email is required' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginClient({ next }: Readonly<{ next: string }>) {
  const router = useRouter();
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let alive = true;
    getProviders()
      .then((providers) => {
        if (!alive) return;
        setGoogleEnabled(Boolean(providers?.google));
      })
      .catch(() => {
        if (!alive) return;
        setGoogleEnabled(false);
      });

    return () => {
      alive = false;
    };
  }, []);

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
    router.push(next || '/');
  }

  return (
    <div className="mc-container py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-7 shadow-xl shadow-violet-200/40 backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-violet-200/40 blur-3xl" />

          <div className="relative">
            <h1 className="text-center text-2xl font-extrabold tracking-tight text-neutral-900">
              Welcome back to <BrandName noWrap />
            </h1>
            <p className="mt-1 text-sm text-neutral-600">Access your account.</p>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`${googleEnabled ? 'mt-5' : 'mt-7'} grid gap-3`}
            >
              <Field label="Email" error={form.formState.errors.email?.message}>
                <input type="email" {...form.register('email')} className="mc-input" />
              </Field>

              <Field label="Password" error={form.formState.errors.password?.message}>
                <input type="password" {...form.register('password')} className="mc-input" />
              </Field>

              <button type="submit" disabled={form.formState.isSubmitting} className="mc-btn mt-2">
                {form.formState.isSubmitting ? 'Signing in…' : 'Login'}
              </button>

              {googleEnabled ? (
                <button
                  type="button"
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 shadow-sm transition-all duration-150 hover:bg-neutral-50 hover:shadow-md active:translate-y-px active:scale-[0.99] active:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/60"
                  onClick={() => signIn('google', { callbackUrl: next || '/' })}
                >
                  <GoogleGIcon />
                  <span>Sign in with Google</span>
                </button>
              ) : null}
            </form>

            <div className="mt-5 text-sm text-neutral-600">
              Don’t have an account?{' '}
              <Link href="/register" className="font-semibold text-fuchsia-700 hover:text-fuchsia-800">
                Register
              </Link>
            </div>
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
}: Readonly<{
  label: string;
  error?: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-neutral-700 font-medium">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function GoogleGIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
      <path
        className="fill-blue-500"
        d="M47.12 24.53c0-1.64-.15-3.21-.43-4.73H24v8.95h12.98c-.56 2.9-2.18 5.36-4.64 7.01v5.83h7.5c4.39-4.04 7.28-10 7.28-17.06z"
      />
      <path
        className="fill-green-500"
        d="M24 48c6.48 0 11.92-2.14 15.9-5.81l-7.5-5.83c-2.08 1.4-4.74 2.23-8.4 2.23-6.24 0-11.53-4.2-13.42-9.86H2.83v6.02C6.78 42.69 14.74 48 24 48z"
      />
      <path
        className="fill-amber-400"
        d="M10.58 28.73A14.6 14.6 0 0 1 9.82 24c0-1.65.29-3.25.76-4.73V13.25H2.83A24 24 0 0 0 0 24c0 3.87.93 7.54 2.83 10.75l7.75-6.02z"
      />
      <path
        className="fill-red-500"
        d="M24 9.41c3.52 0 6.67 1.21 9.16 3.58l6.83-6.83C35.9 2.36 30.48 0 24 0 14.74 0 6.78 5.31 2.83 13.25l7.75 6.02C12.47 13.61 17.76 9.41 24 9.41z"
      />
    </svg>
  );
}
