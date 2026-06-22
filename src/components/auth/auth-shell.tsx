import Image from 'next/image';
import Link from 'next/link';
import { MoonMark } from '@/components/moon-mark';
import { BrandName } from '@/components/brand-name';
import { Button } from '@/components/ui/button';

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=75';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: Readonly<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}>) {
  return (
    <div className="mc-container py-12 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[var(--r-xl)] border border-line shadow-[var(--shadow)] lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] lg:block">
          <Image
            src={AUTH_IMAGE}
            alt="A bouquet of peach roses and dried flowers"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <span className="inline-flex h-8 w-8 text-primary">
              <MoonMark />
            </span>
            <p className="mt-3 max-w-xs font-display text-[1.6rem] leading-snug text-on-dark">
              The best gifts feel like someone was paying attention.
            </p>
          </div>
        </div>

        <div className="bg-bg px-6 py-10 sm:px-10 md:py-14">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="h-7 w-7 text-primary">
              <MoonMark />
            </span>
            <BrandName className="text-lg" noWrap />
          </Link>
          <h1 className="mt-8 font-display text-3xl">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          ) : null}
          <div className="mt-7">{children}</div>
          {footer ? (
            <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  error,
  children,
}: Readonly<{ label: string; error?: string; children: React.ReactNode }>) {
  return (
    <label className="block">
      <span className="mc-label">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : null}
    </label>
  );
}

export function GoogleButton({
  onClick,
  label,
}: Readonly<{ onClick: () => void; label: string }>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      className="w-full gap-3"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
        <path
          fill="#4285F4"
          d="M47.12 24.53c0-1.64-.15-3.21-.43-4.73H24v8.95h12.98c-.56 2.9-2.18 5.36-4.64 7.01v5.83h7.5c4.39-4.04 7.28-10 7.28-17.06z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.92-2.14 15.9-5.81l-7.5-5.83c-2.08 1.4-4.74 2.23-8.4 2.23-6.24 0-11.53-4.2-13.42-9.86H2.83v6.02C6.78 42.69 14.74 48 24 48z"
        />
        <path
          fill="#FBBC05"
          d="M10.58 28.73A14.6 14.6 0 0 1 9.82 24c0-1.65.29-3.25.76-4.73V13.25H2.83A24 24 0 0 0 0 24c0 3.87.93 7.54 2.83 10.75l7.75-6.02z"
        />
        <path
          fill="#EA4335"
          d="M24 9.41c3.52 0 6.67 1.21 9.16 3.58l6.83-6.83C35.9 2.36 30.48 0 24 0 14.74 0 6.78 5.31 2.83 13.25l7.75 6.02C12.47 13.61 17.76 9.41 24 9.41z"
        />
      </svg>
      <span>{label}</span>
    </Button>
  );
}
