import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';

const statusStyles: Record<string, string> = {
  delivered: 'bg-[color-mix(in_oklch,var(--color-success)_16%,white)] text-[var(--color-success)]',
  shipped: 'bg-blush text-claret',
  processing: 'bg-blush text-claret',
  confirmed: 'bg-blush text-claret',
  pending: 'bg-surface-warm text-muted-foreground',
  cancelled: 'bg-surface-warm text-faint line-through',
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn('border-transparent capitalize', statusStyles[status] ?? 'bg-surface text-muted-foreground')}>
      {status}
    </Badge>
  );
}
