'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';
import { AdminHeader, AdminPanel } from '@/components/admin/admin-ui';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { PaymentStatusBadge } from '@/components/payment-status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  receiptUploaded: boolean;
  total: number;
  createdAt: string;
};

const statuses = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        setOrders([]);
        toast.error('Please sign in as an admin to view orders');
        router.push('/login?next=/admin/orders');
        return;
      }
      if (!res.ok) {
        setOrders([]);
        const msg =
          (await res.json().catch(() => null))?.error ??
          'Failed to load orders';
        toast.error(msg);
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      if (!Array.isArray(data)) {
        setOrders([]);
        toast.error('Unexpected response from server');
        return;
      }
      setOrders(data as Order[]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function patchOrder(id: string, body: Record<string, string>) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      toast.error('Update failed');
      return false;
    }
    await load();
    return true;
  }

  async function updateStatus(id: string, status: string) {
    if (await patchOrder(id, { status })) toast.success('Order updated');
  }

  async function approvePayment(id: string) {
    if (await patchOrder(id, { paymentStatus: 'paid', status: 'confirmed' }))
      toast.success('Payment approved');
  }

  async function rejectPayment(id: string) {
    const note = window.prompt(
      'Reason for rejecting this receipt? (optional, shown to the customer)',
    );
    if (note === null) return; // cancelled
    if (await patchOrder(id, { paymentStatus: 'rejected', paymentNote: note }))
      toast.success('Receipt rejected');
  }

  return (
    <div>
      <AdminHeader
        title="Orders"
        description="Review orders and move them through fulfilment."
      />

      <div className="mt-8">
        <AdminPanel>
          {loading ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-line bg-surface text-xs tracking-wide text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Total
                    </th>
                    <th className="px-5 py-3 font-semibold">Placed</th>
                    <th className="px-5 py-3 font-semibold">Update status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((o) => (
                    <tr
                      key={o.id}
                      className="transition-colors hover:bg-surface/60"
                    >
                      <td className="px-5 py-3.5 font-medium text-ink">
                        <a
                          href={`/admin/orders/${o.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          #{o.id.slice(-8).toUpperCase()}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col items-start gap-2">
                          <PaymentStatusBadge status={o.paymentStatus} />
                          {o.receiptUploaded ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={`/api/orders/${o.id}/receipt`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-primary underline-offset-2 hover:underline"
                              >
                                View receipt
                              </a>
                              {o.paymentStatus !== 'paid' ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="h-7 px-2.5 text-xs"
                                    onClick={() => approvePayment(o.id)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2.5 text-xs"
                                    onClick={() => rejectPayment(o.id)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-faint">
                              No receipt yet
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right text-ink tabular-nums">
                        {formatLkr(Number(o.total))}
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(o.createdAt).toLocaleDateString('en-LK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <Select
                          defaultValue={o.status}
                          onValueChange={(v) => updateStatus(o.id, v)}
                        >
                          <SelectTrigger
                            size="sm"
                            aria-label={`Update status for order ${o.id.slice(-8)}`}
                            className="w-40 capitalize"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="capitalize"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
