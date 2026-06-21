import { cn } from '@/lib/cn';

type BrandNameProps = Readonly<{
  className?: string;
  noWrap?: boolean;
}>;

/** The wordmark, set in the display serif. */
export function BrandName({ className = '', noWrap = false }: BrandNameProps) {
  return (
    <span
      className={cn(
        'font-display font-medium tracking-[-0.01em]',
        noWrap && 'whitespace-nowrap',
        className,
      )}
    >
      The Moon Charm
    </span>
  );
}
