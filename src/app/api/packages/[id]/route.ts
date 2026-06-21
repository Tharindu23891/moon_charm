import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { requireAdmin } from '@/lib/server-auth';
import { GiftPackage } from '@/models/GiftPackage';

const updatePackageSchema = z
  .object({
    name: z.string().min(1).max(140).optional(),
    image: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().min(1),
        })
      )
      .max(50)
      .optional(),
    price: z.number().min(0).optional(),
    discountPercent: z.number().min(0).max(100).optional().nullable(),
    popularity: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields' });

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const pkg = await GiftPackage.findById(id).populate('items.productId').lean();
  if (!pkg) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: (pkg as any)._id.toString(),
    name: (pkg as any).name,
    slug: (pkg as any).slug,
    image: (pkg as any).image,
    items: ((pkg as any).items ?? []).map((it: any) => ({
      productId: it.productId?._id?.toString?.() ?? it.productId?.toString?.() ?? '',
      name: it.productId?.name ?? null,
      quantity: it.quantity,
    })),
    price: (pkg as any).price,
    discountPercent: (pkg as any).discountPercent ?? null,
    isFeatured: (pkg as any).isFeatured,
  });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    const msg = e?.message;
    const status = msg === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = updatePackageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const update: any = { ...parsed.data };
  if (parsed.data.discountPercent === null) {
    update.discountPercent = undefined;
  }

  const updated = await GiftPackage.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e: any) {
    const msg = e?.message;
    const status = msg === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const { id } = await ctx.params;
  const dbError = await ensureDatabase();
  if (dbError) return dbError;
  const deleted = await GiftPackage.findByIdAndDelete(id).lean();
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
