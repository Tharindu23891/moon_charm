'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProviders, signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  AuthShell,
  AuthField,
  GoogleButton,
} from '@/components/auth/auth-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      .then(
        (providers) => alive && setGoogleEnabled(Boolean(providers?.google)),
      )
      .catch(() => alive && setGoogleEnabled(false));
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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders and check out faster."
      footer={
        <>
          New here?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <AuthField label="Email" error={form.formState.errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            {...form.register('email')}
          />
        </AuthField>
        <AuthField
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input
            type="password"
            autoComplete="current-password"
            {...form.register('password')}
          />
        </AuthField>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="mt-1 w-full"
        >
          {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {googleEnabled ? (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-faint">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
          <GoogleButton
            label="Continue with Google"
            onClick={() => signIn('google', { callbackUrl: next || '/' })}
          />
        </>
      ) : null}
    </AuthShell>
  );
}
