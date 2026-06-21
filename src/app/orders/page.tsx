import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';
import { formatLkr } from '@/lib/money';
import { OrderStatusBadge } from '@/components/order-status-badge';

export const metadata = { title: 'Your orders' };

export default async function OrdersPage() {
  const { userId, role } = await getSessionUser();

  if (!userId) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">Please sign in</h1>
        <p className="mt-3 text-muted">Sign in to see your order history.</p>
        <Link href="/login?next=/orders" className="mc-btn mt-6">Sign in</Link>
      </div>
    );
  }

  await connectToDatabase();
  const filter = role === 'admin' ? {} : { userId };
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div className="mc-container py-12 md:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)]">
            {role === 'admin' ? 'All orders' : 'Your orders'}
          </h1>
          <p className="mt-2 text-muted">
            {role === 'admin' ? 'Every order placed across the shop.' : 'Everything you’ve sent, and where it is now.'}
          </p>
        </div>
        <Link href="/products" className="mc-btn-outline">Continue shopping</Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-[var(--r-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">No orders yet</p>
          <p className="mt-2 text-sm text-muted">When you place your first order, it will appear here.</p>
          <Link href="/products" className="mc-btn mt-6">Find a gift</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[var(--r-lg)] border border-line">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Order</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Payment</th>
                  <th className="px-5 py-3.5 font-semibold">Total</th>
                  <th className="px-5 py-3.5 font-semibold">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.map((o: any) => (
                  <tr key={o._id.toString()} className="transition-colors hover:bg-surface/60">
                    <td className="px-5 py-4 font-medium text-ink">#{o._id.toString().slice(-8)}</td>
                    <td className="px-5 py-4"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 capitalize text-muted">{o.paymentStatus}</td>
                    <td className="px-5 py-4 font-semibold text-ink">{formatLkr(Number(o.total))}</td>
                    <td className="px-5 py-4 text-muted">{new Date(o.createdAt).toLocaleDateString('en-LK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
