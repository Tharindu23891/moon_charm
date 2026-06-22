import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { requireAdmin } from '@/lib/server-auth';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';

const updateProductSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    shortDescription: z.string().min(1).max(220).optional(),
    description: z.string().min(1).max(5000).optional(),
    images: z.array(z.string().min(1)).max(10).optional(),
    price: z.number().min(0).optional(),
    categorySlug: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
    popularity: z.number().int().min(0).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields' });

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const product = await Product.findById(id).populate('categoryId').lean();
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: (product as any)._id.toString(),
    name: (product as any).name,
    slug: (product as any).slug,
    shortDescription: (product as any).shortDescription,
    description: (product as any).description,
    images: (product as any).images,
    price: (product as any).price,
    stock: (product as any).stock,
    category: (product as any).categoryId
      ? {
          name: (product as any).categoryId.name,
          slug: (product as any).categoryId.slug,
        }
      : null,
    isFeatured: (product as any).isFeatured,
    popularity: (product as any).popularity,
  });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
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
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const update: any = { ...parsed.data };

  if (parsed.data.categorySlug) {
    const category = await Category.findOne({
      slug: parsed.data.categorySlug,
    }).lean();
    if (!category) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    update.categoryId = category._id;
    delete update.categorySlug;
  }

  const updated = await Product.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
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
  const deleted = await Product.findByIdAndDelete(id).lean();
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
