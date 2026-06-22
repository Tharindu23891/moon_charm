import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/api';
import { getSessionUser } from '@/lib/server-auth';
import { Order } from '@/models/Order';

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

  const order = await Order.findById(id).lean();
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (role !== 'admin' && (order as any).userId.toString() !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    id: (order as any)._id.toString(),
    status: (order as any).status,
    paymentStatus: (order as any).paymentStatus,
    paymentMethod: (order as any).paymentMethod,
    subtotal: (order as any).subtotal,
    total: (order as any).total,
    address: (order as any).address,
    items: (order as any).items.map((it: any) => ({
      itemType: it.itemType,
      refId: it.refId.toString(),
      name: it.name,
      image: it.image,
      unitPrice: it.unitPrice,
      quantity: it.quantity,
    })),
    createdAt: (order as any).createdAt,
  });
}
