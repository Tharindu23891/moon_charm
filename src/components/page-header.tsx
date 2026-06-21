import { cn } from '@/lib/cn';

type PageHeaderProps = Readonly<{
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  children?: React.ReactNode;
}>;

/** Standard heading block for inner (list/content) pages. */
export function PageHeader({ eyebrow, title, description, align = 'left', className, children }: PageHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow ? <span className="mc-eyebrow">{eyebrow}</span> : null}
      <h1 className={cn('text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.05]', eyebrow && 'mt-4')}>{title}</h1>
      {description ? (
        <p className={cn('mt-3 text-[1.05rem] leading-relaxed text-muted', align === 'left' && 'max-w-2xl')}>
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}
