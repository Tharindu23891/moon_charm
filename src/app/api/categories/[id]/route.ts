import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { requireAdmin } from '@/lib/server-auth';
import { Category } from '@/models/Category';
import { slugify } from '@/lib/slugify';

const updateCategorySchema = z
  .object({
    name: z.string().min(1).max(80).optional(),
    slug: z.string().min(1).max(120).optional(),
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
  const parsed = updateCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await connectToDatabase();

  const update: any = {};
  if (parsed.data.name) update.name = parsed.data.name;
  if (parsed.data.slug) update.slug = slugify(parsed.data.slug);

  if (update.slug) {
    const exists = await Category.findOne({ slug: update.slug, _id: { $ne: id } }).lean();
    if (exists) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });
    }
  }

  const updated = await Category.findByIdAndUpdate(id, update, { new: true }).lean();
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
    const status = e?.message === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const { id } = await ctx.params;
  await connectToDatabase();

  const deleted = await Category.findByIdAndDelete(id).lean();
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
