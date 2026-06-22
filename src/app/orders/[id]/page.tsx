import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongoose';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';
import { formatLkr } from '@/lib/money';
import { bankDetails } from '@/lib/site';
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
} from '@/lib/whatsapp-link';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { PaymentStatusBadge } from '@/components/payment-status-badge';
import { Button } from '@/components/ui/button';
import { ReceiptUpload } from './receipt-upload';

export const metadata = { title: 'Your order' };

const receiptNote: Record<string, string> = {
  paid: 'Confirmed',
  under_review: 'Uploaded (under review)',
  rejected: 'Rejected — re-uploading',
  unpaid: 'Pending — I’ll send it shortly',
};

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { userId, role } = await getSessionUser();
  if (!userId) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">Please sign in</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in to view your order.
        </p>
        <Button asChild className="mt-6">
          <Link href="/login?next=/orders">Sign in</Link>
        </Button>
      </div>
    );
  }

  const { id } = await params;
  const { placed } = await searchParams;

  // Admins get the full operational view, not the customer-facing one.
  if (role === 'admin') redirect(`/admin/orders/${id}`);

  await connectToDatabase();
  const order = (await Order.findById(id).lean()) as any;
  if (!order) notFound();
  if (order.userId.toString() !== userId) notFound();

  const ref = `#${order._id.toString().slice(-8).toUpperCase()}`;
  const paid = order.paymentStatus === 'paid';
  const placedAt = new Date(order.createdAt).toLocaleDateString('en-LK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const waUrl = buildWhatsAppUrl(
    buildOrderWhatsAppMessage({
      reference: ref,
      fullName: order.address.fullName,
      phone: order.address.phone,
      email: order.address.email,
      paymentMethod: 'bank',
      receiptStatus: receiptNote[order.paymentStatus] ?? 'Pending',
      address: order.address,
      items: order.items.map((it: any) => ({
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
      total: order.total,
    }),
  );

  return (
    <div className="mc-container py-12 md:py-16">
      {placed === '1' ? (
        <div className="mb-8 rounded-[var(--r)] border border-line bg-blush/40 px-5 py-4">
          <p className="font-medium text-ink">
            Order placed. One step left: pay by bank transfer and upload your
            receipt below.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[clamp(1.8rem,4vw,2.6rem)]">
            Order {ref}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {placedAt}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Payment + receipt */}
        <div className="space-y-6">
          {paid ? (
            <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
              <h2 className="font-display text-xl">Payment confirmed</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thank you. We’ve confirmed your payment and your order is being
                prepared.
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
                <h2 className="font-display text-xl">Pay by bank transfer</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Transfer the total below, then upload your receipt. Add the
                  reference <span className="font-medium text-ink">{ref}</span>{' '}
                  to your transfer so we can match it.
                </p>
                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <Detail label="Bank" value={bankDetails.bankName} />
                  <Detail
                    label="Account name"
                    value={bankDetails.accountName}
                  />
                  <Detail
                    label="Account number"
                    value={bankDetails.accountNumber}
                  />
                  <Detail label="Branch" value={bankDetails.branch} />
                  <Detail label="Reference" value={ref} />
                  <Detail
                    label="Amount"
                    value={formatLkr(order.total)}
                    emphasize
                  />
                </dl>
              </div>

              <div className="rounded-[var(--r-lg)] border border-line bg-bg p-6">
                <h2 className="font-display text-xl">Your receipt</h2>
                {order.paymentStatus === 'rejected' ? (
                  <p className="mt-2 text-sm text-danger">
                    Your last receipt couldn’t be verified
                    {order.paymentNote ? `: ${order.paymentNote}` : ''}. Please
                    upload it again.
                  </p>
                ) : order.paymentStatus === 'under_review' ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Receipt received. We’re reviewing your payment and will
                    confirm shortly. You can replace it if you uploaded the
                    wrong file.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Once you’ve made the transfer, upload a PDF or photo of the
                    receipt here.
                  </p>
                )}
                <div className="mt-4">
                  <ReceiptUpload
                    orderId={order._id.toString()}
                    hasReceipt={Boolean(order.receiptUploaded)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="rounded-[var(--r-lg)] border border-line bg-bg p-6">
            <h2 className="font-display text-xl">Have a question?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Message us about this order on WhatsApp. Your order details come
              pre-filled.
            </p>
            <Button asChild variant="outline" className="mt-4 gap-2.5">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Message us on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[var(--r-lg)] border border-line bg-surface p-6">
            <h2 className="font-display text-xl">Your order</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {order.items.map((it: any, i: number) => (
                <li key={i} className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">
                    <span className="text-ink">{it.quantity}×</span> {it.name}
                  </span>
                  <span className="shrink-0 font-medium text-ink">
                    {formatLkr(it.unitPrice * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl text-ink">
                {formatLkr(order.total)}
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm">
            <Link
              href="/orders"
              className="text-muted-foreground underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Back to your orders
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs tracking-[0.1em] text-faint uppercase">{label}</dt>
      <dd
        className={
          emphasize
            ? 'mt-0.5 font-display text-lg text-ink'
            : 'mt-0.5 font-medium text-ink'
        }
      >
        {value}
      </dd>
    </div>
  );
}
