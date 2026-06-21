import { cn } from '@/lib/cn';

/** The Moon Charm crescent, set inside a thin charm ring. Inherits currentColor. */
export function MoonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path
        d="M21.6 20.9a7.4 7.4 0 0 1-9.3-10.6 0.6 0.6 0 0 0-0.74-0.84A8.6 8.6 0 1 0 22.6 21.7a0.6 0.6 0 0 0-0.97-0.78z"
        fill="currentColor"
      />
      <circle cx="22.3" cy="10.6" r="1.15" fill="currentColor" />
    </svg>
  );
}
