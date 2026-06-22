import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';

const config: Record<string, { label: string; className: string }> = {
  unpaid: {
    label: 'Awaiting payment',
    className: 'bg-surface-warm text-muted-foreground',
  },
  under_review: {
    label: 'Under review',
    className: 'bg-blush text-claret',
  },
  paid: {
    label: 'Paid',
    className:
      'bg-[color-mix(in_oklch,var(--color-success)_16%,white)] text-[var(--color-success)]',
  },
  rejected: {
    label: 'Receipt rejected',
    className:
      'bg-[color-mix(in_oklch,var(--color-danger)_14%,white)] text-danger',
  },
  refunded: {
    label: 'Refunded',
    className: 'bg-surface-warm text-faint',
  },
};

export function PaymentStatusBadge({ status }: { status: string }) {
  const c = config[status] ?? {
    label: status,
    className: 'bg-surface text-muted-foreground',
  };
  return (
    <Badge className={cn('border-transparent', c.className)}>{c.label}</Badge>
  );
}

export function paymentStatusLabel(status: string): string {
  return config[status]?.label ?? status;
}
