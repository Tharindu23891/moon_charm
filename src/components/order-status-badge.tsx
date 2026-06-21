import { cn } from '@/lib/cn';

const statusStyles: Record<string, string> = {
  delivered: 'bg-[color-mix(in_oklch,var(--color-success)_16%,white)] text-[var(--color-success)]',
  shipped: 'bg-blush text-accent',
  processing: 'bg-blush text-accent',
  confirmed: 'bg-blush text-accent',
  pending: 'bg-surface-warm text-muted',
  cancelled: 'bg-surface-warm text-faint line-through',
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('mc-pill border-transparent capitalize', statusStyles[status] ?? 'bg-surface text-muted')}>
      {status}
    </span>
  );
}
