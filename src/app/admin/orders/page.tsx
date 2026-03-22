'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetch('/api/orders').then((r) => r.json());
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin · Orders</h1>
          <p className="mt-1 text-sm text-neutral-600">View and update orders.</p>
        </div>
        <Link href="/admin" className="text-sm text-neutral-700 hover:text-neutral-900">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        {loading ? (
          <div className="p-4 text-sm text-neutral-600">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-4 text-sm text-neutral-600">No orders.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-neutral-50 text-xs text-neutral-600">
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
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{o.id.slice(-8)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="rounded-lg border px-3 py-2 text-sm"
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
