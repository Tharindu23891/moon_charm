import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { SortOrder } from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import { requireAdmin } from '@/lib/server-auth';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { slugify } from '@/lib/slugify';

const createProductSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(180).optional(),
  shortDescription: z.string().min(1).max(220),
  description: z.string().min(1).max(5000),
  images: z.array(z.string().min(1)).max(10).optional().default([]),
  price: z.number().min(0),
  categorySlug: z.string().min(1),
  stock: z.number().int().min(0),
  isFeatured: z.boolean().optional().default(false),
});

function parseSort(sort: string | null): Record<string, SortOrder> {
  switch (sort) {
    case 'price-asc':
      return { price: 1 };
    case 'price-desc':
      return { price: -1 };
    case 'popularity':
      return { popularity: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const category = url.searchParams.get('category');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const sort = url.searchParams.get('sort');

  await connectToDatabase();

  const filter: any = {};

  if (q) {
    filter.$text = { $search: q };
  }

  if (category) {
    const cat = await Category.findOne({ slug: category }).lean();
    if (cat) filter.categoryId = cat._id;
  }

  const priceFilter: any = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);
  if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

  const products = await Product.find(filter)
    .sort(parseSort(sort))
    .limit(200)
    .populate('categoryId')
    .lean();

  return NextResponse.json(
    products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      shortDescription: p.shortDescription,
      price: p.price,
      images: p.images,
      stock: p.stock,
      category: p.categoryId ? { name: p.categoryId.name, slug: p.categoryId.slug } : null,
      isFeatured: p.isFeatured,
      popularity: p.popularity,
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
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await connectToDatabase();

  const category = await Category.findOne({ slug: parsed.data.categorySlug }).lean();
  if (!category) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const exists = await Product.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json({ error: 'Product slug already exists' }, { status: 409 });
  }

  const created = await Product.create({
    name: parsed.data.name,
    slug,
    shortDescription: parsed.data.shortDescription,
    description: parsed.data.description,
    images: parsed.data.images,
    price: parsed.data.price,
    categoryId: category._id,
    stock: parsed.data.stock,
    isFeatured: parsed.data.isFeatured,
  });

  return NextResponse.json({ id: created._id.toString() }, { status: 201 });
}
