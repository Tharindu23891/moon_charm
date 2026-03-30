import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';
import { formatLkr } from '@/lib/money';

export default async function OrdersPage() {
  const { userId, role } = await getSessionUser();
  if (!userId) return null;

  await connectToDatabase();

  const filter = role === 'admin' ? {} : { userId };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div className="mc-container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Orders</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">Order history and status.</p>
        </div>
        <Link href="/products" className="mc-pill hover:bg-white">
          Continue shopping
        </Link>
      </div>

      <div className="mc-card mt-6 overflow-hidden p-0">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-600">No orders yet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/50 bg-white/40 text-xs text-zinc-600">
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
                <tr key={o._id.toString()} className="border-b border-white/50 last:border-0 hover:bg-white/35">
                  <td className="px-4 py-3 font-medium">{o._id.toString().slice(-8)}</td>
                  <td className="px-4 py-3">{o.status}</td>
                  <td className="px-4 py-3">{o.paymentStatus}</td>
                  <td className="px-4 py-3">{formatLkr(Number(o.total))}</td>
                  <td className="px-4 py-3 text-zinc-600">
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
