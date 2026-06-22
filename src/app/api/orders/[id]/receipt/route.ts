import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { getSessionUser, requireUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';
import { sendOwnerEmail } from '@/lib/mailer';
import { siteConfig } from '@/lib/site';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

// Vercel caps the serverless request body at 4.5MB and base64 inflates ~33%,
// so keep the decoded file comfortably under that.
const MAX_BYTES = 3 * 1024 * 1024;

const uploadSchema = z.object({
  receipt: z.string().min(1),
  filename: z.string().max(200).optional().default(''),
});

const DATA_URL = /^data:([^;]+);base64,(.+)$/;

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  let userId: string;
  try {
    ({ userId } = await requireUser());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const match = DATA_URL.exec(parsed.data.receipt);
  if (!match) {
    return NextResponse.json(
      { error: 'Receipt must be a PDF or image file' },
      { status: 400 },
    );
  }
  const [, mime, base64] = match;
  if (!ALLOWED_TYPES.has(mime)) {
    return NextResponse.json(
      { error: 'Only PDF, JPG, PNG, or WebP receipts are accepted' },
      { status: 415 },
    );
  }
  const approxBytes = Math.floor((base64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Receipt is too large. Please keep it under 3MB.' },
      { status: 413 },
    );
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const order = await Order.findOne({ _id: id, userId });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.paymentStatus === 'paid') {
    return NextResponse.json(
      { error: 'This order is already confirmed' },
      { status: 409 },
    );
  }

  order.set('receipt', {
    data: parsed.data.receipt,
    filename: parsed.data.filename,
    contentType: mime,
    uploadedAt: new Date(),
  });
  order.receiptUploaded = true;
  order.paymentStatus = 'under_review';
  order.paymentNote = '';
  await order.save();

  // Notify the shop owner so they know to review it. Best-effort.
  const ref = `#${order._id.toString().slice(-8).toUpperCase()}`;
  try {
    await sendOwnerEmail(
      `Receipt uploaded for order ${ref}`,
      [
        `A customer uploaded a payment receipt for order ${ref}.`,
        `Customer: ${order.address?.fullName ?? ''} (${order.address?.phone ?? ''})`,
        '',
        `Review it here: ${siteConfig.url}/admin/orders`,
      ].join('\n'),
    );
  } catch (err) {
    console.error('[receipt] owner email failed:', err);
  }

  return NextResponse.json({ ok: true });
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { userId, role } = await getSessionUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const order = await Order.findById(id).select('+receipt userId').lean();
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (role !== 'admin' && (order as any).userId.toString() !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const receipt = (order as any).receipt;
  if (!receipt?.data) {
    return NextResponse.json({ error: 'No receipt' }, { status: 404 });
  }

  const match = DATA_URL.exec(receipt.data);
  if (!match) {
    return NextResponse.json({ error: 'Corrupt receipt' }, { status: 500 });
  }
  const [, mime, base64] = match;
  const buffer = Buffer.from(base64, 'base64');

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': mime,
      'Content-Disposition': `inline; filename="${receipt.filename || 'receipt'}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
