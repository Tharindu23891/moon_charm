import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongoose';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';
import { formatLkr } from '@/lib/money';
import { AdminHeader, AdminPanel } from '@/components/admin/admin-ui';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { PaymentStatusBadge } from '@/components/payment-status-badge';
import { Button } from '@/components/ui/button';
import { OrderAdminControls } from './order-admin-controls';

export const metadata = { title: 'Order details' };

const paymentMethodLabel: Record<string, string> = {
  bank: 'Bank transfer',
  cod: 'Cash on delivery',
  card: 'Card',
};

// Best-effort conversion of a Sri Lankan phone number to wa.me format
// (country code + number, digits only). Falls back to the raw digits.
function toWaNumber(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('94')) return digits;
  if (digits.startsWith('0')) return `94${digits.slice(1)}`;
  return digits;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId, role } = await getSessionUser();
  if (!userId) redirect('/login?next=/admin/orders');
  if (role !== 'admin') redirect('/');

  const { id } = await params;

  await connectToDatabase();
  const order = (await Order.findById(id).lean()) as any;
  if (!order) notFound();

  const ref = `#${order._id.toString().slice(-8).toUpperCase()}`;
  const placedAt = new Date(order.createdAt).toLocaleDateString('en-LK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const addr = order.address;
  const waNumber = toWaNumber(addr.phone ?? '');
  const customerWaUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hi ${addr.fullName?.split(' ')[0] ?? ''}, this is THE MOON CHARM about your order ${ref}.`,
      )}`
    : null;

  return (
    <div>
      <AdminHeader
        title={`Order ${ref}`}
        description={`Placed ${placedAt}`}
        actions={
          <>
            <PaymentStatusBadge status={order.paymentStatus} />
            <OrderStatusBadge status={order.status} />
            <Button asChild variant="outline">
              <Link href="/admin/orders">Back to orders</Link>
            </Button>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <AdminPanel title="Manage order">
            <div className="space-y-5 p-5">
              <OrderAdminControls
                orderId={order._id.toString()}
                status={order.status}
                paymentStatus={order.paymentStatus}
                receiptUploaded={Boolean(order.receiptUploaded)}
              />
              {order.paymentNote ? (
                <p className="rounded-[var(--r)] bg-surface px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-ink">
                    Note to customer:
                  </span>{' '}
                  {order.paymentNote}
                </p>
              ) : null}
            </div>
          </AdminPanel>

          <AdminPanel title="Payment">
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Info
                label="Method"
                value={
                  paymentMethodLabel[order.paymentMethod] ?? order.paymentMethod
                }
              />
              <div>
                <span className="mc-label">Status</span>
                <div className="mt-1.5">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="mc-label">Receipt</span>
                <div className="mt-1.5">
                  {order.receiptUploaded ? (
                    <a
                      href={`/api/orders/${order._id.toString()}/receipt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary underline-offset-2 hover:underline"
                    >
                      View uploaded receipt
                    </a>
                  ) : (
                    <span className="text-sm text-faint">
                      No receipt uploaded yet
                    </span>
                  )}
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Customer">
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <Info label="Name" value={addr.fullName} />
              <Info
                label="Phone"
                value={addr.phone}
                href={addr.phone ? `tel:${addr.phone}` : undefined}
              />
              <Info
                label="Email"
                value={addr.email}
                href={addr.email ? `mailto:${addr.email}` : undefined}
              />
            </div>
            {customerWaUrl ? (
              <div className="border-t border-line px-5 py-4">
                <Button asChild variant="outline" className="gap-2.5">
                  <a
                    href={customerWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Message customer on WhatsApp
                  </a>
                </Button>
              </div>
            ) : null}
          </AdminPanel>

          <AdminPanel title="Delivery address">
            <div className="space-y-0.5 p-5 text-sm leading-relaxed text-ink">
              <p>{addr.fullName}</p>
              <p>{addr.line1}</p>
              {addr.line2 ? <p>{addr.line2}</p> : null}
              <p>
                {[addr.city, addr.state, addr.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{addr.country}</p>
            </div>
          </AdminPanel>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AdminPanel title="Items">
            <ul className="divide-y divide-line">
              {order.items.map((it: any, i: number) => (
                <li key={i} className="flex items-start gap-3 p-4">
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-[var(--r)] border border-line object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{it.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {it.quantity} × {formatLkr(it.unitPrice)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-ink tabular-nums">
                    {formatLkr(it.unitPrice * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-line p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-ink tabular-nums">
                  {formatLkr(order.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="font-medium">Total</span>
                <span className="font-display text-lg text-ink tabular-nums">
                  {formatLkr(order.total)}
                </span>
              </div>
            </div>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <span className="mc-label">{label}</span>
      <p className="mt-1 font-medium break-words text-ink">
        {href ? (
          <a href={href} className="hover:text-primary hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </p>
    </div>
  );
}
