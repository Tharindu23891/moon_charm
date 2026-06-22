import { cn } from '@/lib/cn';

/**
 * The Moon Charm — a crescent moon set inside a fine charm ring with a single
 * bead (brand mark, Direction A). Inherits currentColor: use text-primary on
 * light surfaces, white on the primary/ink fills.
 */
export function MoonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn('h-full w-full', className)}
    >
      <circle className="mc-mark-ring" cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.8" />
      <mask id="moon-charm-crescent">
        <rect width="100" height="100" fill="#000" />
        <circle cx="49" cy="52" r="27" fill="#fff" />
        <circle cx="61" cy="43" r="23" fill="#000" />
      </mask>
      <rect className="mc-mark-body" width="100" height="100" fill="currentColor" mask="url(#moon-charm-crescent)" />
      <circle className="mc-mark-body" cx="67" cy="35" r="3.1" fill="currentColor" />
    </svg>
  );
}
