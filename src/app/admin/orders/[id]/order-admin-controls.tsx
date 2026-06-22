'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export function OrderAdminControls({
  orderId,
  status,
  paymentStatus,
  receiptUploaded,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
  receiptUploaded: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(body: Record<string, string>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        toast.error('Update failed');
        return false;
      }
      router.refresh();
      return true;
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(next: string) {
    if (next === status) return;
    if (await patch({ status: next })) toast.success('Order updated');
  }

  async function approvePayment() {
    if (await patch({ paymentStatus: 'paid', status: 'confirmed' }))
      toast.success('Payment approved');
  }

  async function rejectPayment() {
    const note = window.prompt(
      'Reason for rejecting this receipt? (optional, shown to the customer)',
    );
    if (note === null) return; // cancelled
    if (await patch({ paymentStatus: 'rejected', paymentNote: note }))
      toast.success('Receipt rejected');
  }

  const showPaymentActions = receiptUploaded && paymentStatus !== 'paid';

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <span className="mc-label">Fulfilment status</span>
        <Select
          defaultValue={status}
          onValueChange={updateStatus}
          disabled={busy}
        >
          <SelectTrigger className="mt-1.5 w-full capitalize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <span className="mc-label">Payment</span>
        {showPaymentActions ? (
          <div className="mt-1.5 flex flex-wrap gap-2">
            <Button onClick={approvePayment} disabled={busy}>
              Approve payment
            </Button>
            <Button variant="outline" onClick={rejectPayment} disabled={busy}>
              Reject receipt
            </Button>
          </div>
        ) : (
          <p className="mt-2.5 text-sm text-muted-foreground">
            {paymentStatus === 'paid'
              ? 'Payment confirmed — no action needed.'
              : 'Waiting for the customer to upload a receipt.'}
          </p>
        )}
      </div>
    </div>
  );
}
