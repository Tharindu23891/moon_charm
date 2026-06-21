'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';
import { AdminHeader, AdminPanel } from '@/components/admin/admin-ui';
import { OrderStatusBadge } from '@/components/order-status-badge';

type Order = {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
};

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const;

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
        const msg = (await res.json().catch(() => null))?.error ?? 'Failed to load orders';
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

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error('Update failed');
      return;
    }
    toast.success('Order updated');
    await load();
  }

  return (
    <div>
      <AdminHeader title="Orders" description="Review orders and move them through fulfilment." />

      <div className="mt-8">
        <AdminPanel>
          {loading ? (
            <p className="px-5 py-8 text-sm text-muted">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Payment</th>
                    <th className="px-5 py-3 text-right font-semibold">Total</th>
                    <th className="px-5 py-3 font-semibold">Placed</th>
                    <th className="px-5 py-3 font-semibold">Update status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((o) => (
                    <tr key={o.id} className="transition-colors hover:bg-surface/60">
                      <td className="px-5 py-3.5 font-medium text-ink">#{o.id.slice(-8)}</td>
                      <td className="px-5 py-3.5"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5 capitalize text-muted">{o.paymentStatus}</td>
                      <td className="px-5 py-3.5 text-right tabular-nums text-ink">{formatLkr(Number(o.total))}</td>
                      <td className="px-5 py-3.5 text-muted">{new Date(o.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3.5">
                        <select
                          defaultValue={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          aria-label={`Update status for order ${o.id.slice(-8)}`}
                          className="mc-select mc-input h-9 w-40 py-1.5 text-sm capitalize"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                          ))}
                        </select>
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
