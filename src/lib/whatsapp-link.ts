import { siteConfig } from '@/lib/site';
import { formatLkr } from '@/lib/money';

// Builds a "click to chat" wa.me link with the order pre-filled, so the
// customer lands in WhatsApp with the message ready and just taps Send.
// Nothing here is secret: the number is public and the link is client-side.

export type OrderForWhatsApp = {
  reference?: string;
  fullName: string;
  phone: string;
  email: string;
  paymentMethod: 'cod' | 'card' | 'bank';
  receiptStatus?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
};

const paymentLabels: Record<string, string> = {
  cod: 'Cash on delivery',
  card: 'Card',
  bank: 'Bank transfer',
};

export function buildOrderWhatsAppMessage(order: OrderForWhatsApp): string {
  const { address: addr } = order;
  const lines = ['Hi THE MOON CHARM! I’d like to confirm my order.', ''];
  if (order.reference) lines.push(`Order: ${order.reference}`);
  lines.push(`Name: ${order.fullName}`, `Phone: ${order.phone}`);
  if (order.email) lines.push(`Email: ${order.email}`);
  lines.push('', 'Items:');
  for (const it of order.items) {
    lines.push(
      `• ${it.quantity}× ${it.name} — ${formatLkr(it.unitPrice * it.quantity)}`,
    );
  }
  lines.push(
    '',
    `Total: ${formatLkr(order.total)}`,
    `Payment: ${paymentLabels[order.paymentMethod] ?? order.paymentMethod}`,
  );
  if (order.receiptStatus) lines.push(`Receipt: ${order.receiptStatus}`);
  lines.push(
    '',
    'Deliver to:',
    [addr.line1, addr.line2].filter(Boolean).join(', '),
    [addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '),
    addr.country,
  );
  return lines.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
