import { cn } from '@/lib/cn';

export function AdminHeader({
  title,
  description,
  actions,
}: Readonly<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[clamp(1.7rem,3vw,2.2rem)] leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export function AdminPanel({
  title,
  children,
  className,
  bodyClassName,
}: Readonly<{
  title?: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}>) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-[var(--r-lg)] border border-line bg-bg',
        className,
      )}
    >
      {title ? (
        <div className="border-b border-line px-5 py-3.5 text-sm font-semibold text-ink">
          {title}
        </div>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/** Small label for admin form fields. */
export function AdminField({
  label,
  error,
  hint,
  children,
}: Readonly<{
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="block">
      <span className="mc-label">{label}</span>
      {hint ? (
        <span className="-mt-1 mb-1.5 block text-xs text-faint">{hint}</span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-danger">{error}</span>
      ) : null}
    </label>
  );
}
