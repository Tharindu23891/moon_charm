import Link from 'next/link';
import { cn } from '@/lib/cn';

type SectionHeadingProps = Readonly<{
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { href: string; label: string };
  align?: 'left' | 'center';
  className?: string;
}>;

export function SectionHeading({ kicker, title, description, action, align = 'left', className }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between',
        align === 'center' && 'sm:flex-col sm:items-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {kicker ? <span className="mc-eyebrow">{kicker}</span> : null}
        <h2 className={cn('text-[clamp(1.7rem,3vw,2.5rem)] leading-tight', kicker && 'mt-4')}>{title}</h2>
        {description ? <p className="mt-3 text-[1.05rem] text-muted-foreground">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary"
        >
          {action.label}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </Link>
      ) : null}
    </div>
  );
}
