import { NextResponse } from 'next/server';
import { z } from 'zod';
import { connectToDatabase } from '@/lib/mongoose';
import { requireAdmin } from '@/lib/server-auth';
import { Category } from '@/models/Category';
import { slugify } from '@/lib/slugify';

const createCategorySchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(120).optional(),
});

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return NextResponse.json(
    categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
    }))
  );
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e: any) {
    const msg = e?.message;
    const status = msg === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const body = await req.json().catch(() => null);
  const parsed = createCategorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await connectToDatabase();

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const exists = await Category.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json({ error: 'Category slug already exists' }, { status: 409 });
  }

  const created = await Category.create({ name: parsed.data.name, slug });
  return NextResponse.json(
    { id: created._id.toString(), name: created.name, slug: created.slug },
    { status: 201 }
  );
}
