import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { requireAdmin } from '@/lib/server-auth';
import { Order } from '@/models/Order';

const updateOrderSchema = z
  .object({
    status: z
      .enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
      .optional(),
    paymentStatus: z.enum(['unpaid', 'paid', 'refunded']).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields' });

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    const status = e?.message === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = updateOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;
  const updated = await Order.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
