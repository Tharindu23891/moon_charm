import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { SortOrder } from 'mongoose';
import { ensureDatabase } from '@/lib/api';
import { requireAdmin } from '@/lib/server-auth';
import { GiftPackage } from '@/models/GiftPackage';
import { slugify } from '@/lib/slugify';

const createPackageSchema = z.object({
  name: z.string().min(1).max(140),
  slug: z.string().min(1).max(180).optional(),
  image: z.string().optional().default(''),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .max(50)
    .optional()
    .default([]),
  price: z.number().min(0),
  discountPercent: z.number().min(0).max(100).optional(),
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
  const sort = url.searchParams.get('sort');

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const packages = await GiftPackage.find({})
    .sort(parseSort(sort))
    .limit(200)
    .populate('items.productId')
    .lean();

  return NextResponse.json(
    packages.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      image: p.image,
      items: (p.items ?? []).map((it: any) => ({
        productId: it.productId?._id?.toString?.() ?? it.productId?.toString?.() ?? '',
        name: it.productId?.name ?? null,
        quantity: it.quantity,
      })),
      price: p.price,
      discountPercent: p.discountPercent ?? null,
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
  const parsed = createPackageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const exists = await GiftPackage.findOne({ slug }).lean();
  if (exists) {
    return NextResponse.json({ error: 'Package slug already exists' }, { status: 409 });
  }

  const created = await GiftPackage.create({
    name: parsed.data.name,
    slug,
    image: parsed.data.image,
    items: parsed.data.items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
    })),
    price: parsed.data.price,
    discountPercent: parsed.data.discountPercent,
    isFeatured: parsed.data.isFeatured,
  });

  return NextResponse.json({ id: created._id.toString() }, { status: 201 });
}
