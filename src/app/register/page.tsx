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

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.email({ message: 'Valid email is required' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
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
      const msg =
        (await res.json().catch(() => null))?.error ?? 'Registration failed';
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
    toast.success('Welcome to THE MOON CHARM');
    router.push('/');
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Save your details, track orders, and gift with ease."
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <AuthField label="Name" error={form.formState.errors.name?.message}>
          <Input autoComplete="name" {...form.register('name')} />
        </AuthField>
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
            autoComplete="new-password"
            {...form.register('password')}
          />
        </AuthField>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="mt-1 w-full"
        >
          {form.formState.isSubmitting ? 'Creating…' : 'Create account'}
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
            onClick={() => signIn('google', { callbackUrl: '/' })}
          />
        </>
      ) : null}
    </AuthShell>
  );
}
