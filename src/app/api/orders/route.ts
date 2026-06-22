import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { getSessionUser, requireUser } from '@/lib/server-auth';
import { Cart } from '@/models/Cart';
import { Order } from '@/models/Order';

const placeOrderSchema = z.object({
  paymentMethod: z.enum(['cod', 'card', 'bank']),
  address: z.object({
    fullName: z.string().min(1).max(120),
    email: z.string().email(),
    phone: z.string().min(5).max(30),
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional().default(''),
    city: z.string().min(1).max(100),
    state: z.string().max(100).optional().default(''),
    postalCode: z.string().min(1).max(30),
    country: z.string().min(1).max(80),
  }),
});

export async function GET() {
  const { userId, role } = await getSessionUser();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const filter = role === 'admin' ? {} : { userId };
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();

  return NextResponse.json(
    orders.map((o: any) => ({
      id: o._id.toString(),
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      total: o.total,
      createdAt: o.createdAt,
    })),
  );
}

export async function POST(req: Request) {
  let userId: string;
  try {
    ({ userId } = await requireUser());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = placeOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const cart = await Cart.findOne({ userId }).lean();
  if (!cart || !cart.items || cart.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const items = cart.items.map((it: any) => ({
    itemType: it.itemType,
    refId: it.refId,
    name: it.name,
    image: it.image,
    unitPrice: it.unitPrice,
    quantity: it.quantity,
  }));

  const subtotal = items.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0,
  );
  const total = subtotal;

  const order = await Order.create({
    userId,
    items,
    address: parsed.data.address,
    subtotal,
    total,
    paymentMethod: parsed.data.paymentMethod,
    paymentStatus: 'unpaid',
    status: 'pending',
  });

  await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { upsert: true },
  );

  return NextResponse.json({ id: order._id.toString() }, { status: 201 });
}
