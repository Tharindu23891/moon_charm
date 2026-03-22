import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';

export default async function OrdersPage() {
  const { userId, role } = await getSessionUser();
  if (!userId) return null;

  await connectToDatabase();

  const filter = role === 'admin' ? {} : { userId };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-neutral-600">Order history and status.</p>
        </div>
        <Link href="/products" className="text-sm text-neutral-700 hover:text-neutral-900">
          Continue shopping
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border bg-white">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-600">No orders yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-neutral-50 text-xs text-neutral-600">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id.toString()} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{o._id.toString().slice(-8)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {new Date(o.createdAt).toLocaleDateString()}
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
