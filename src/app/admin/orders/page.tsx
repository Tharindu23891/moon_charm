'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';

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
        toast.error('Please log in as admin to view orders');
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
        const msg = (data as any)?.error ?? 'Unexpected response from server';
        toast.error(msg);
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
    toast.success('Updated');
    await load();
  }

  return (
    <div className="mc-container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Admin · Orders</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">View and update orders.</p>
        </div>
        <Link href="/admin" className="mc-pill hover:bg-white">
          Back to dashboard
        </Link>
      </div>

      <div className="mc-card mt-6 overflow-hidden p-0">
        {loading ? (
          <div className="p-4 text-sm text-zinc-600">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-4 text-sm text-zinc-600">No orders.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/50 bg-white/40 text-xs text-zinc-600">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/50 last:border-0 hover:bg-white/35">
                  <td className="px-4 py-3 font-medium">{o.id.slice(-8)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">{formatLkr(Number(o.total))}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="mc-input w-44"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
