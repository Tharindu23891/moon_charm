import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { requireUser } from '@/lib/server-auth';
import { Cart } from '@/models/Cart';
import { GiftPackage } from '@/models/GiftPackage';
import { Product } from '@/models/Product';
import { applyDiscount } from '@/lib/pricing';

const cartUpsertSchema = z.object({
  items: z.array(
    z.object({
      itemType: z.enum(['product', 'package']),
      refId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    }),
  ),
});

export async function GET() {
  let userId: string;
  try {
    ({ userId } = await requireUser());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;
  const cart = await Cart.findOne({ userId }).lean();

  return NextResponse.json({
    items:
      cart?.items?.map((it: any) => ({
        itemType: it.itemType,
        refId: it.refId.toString(),
        name: it.name,
        image: it.image,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })) ?? [],
  });
}

export async function PUT(req: Request) {
  let userId: string;
  try {
    ({ userId } = await requireUser());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = cartUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const productIds = parsed.data.items
    .filter((i) => i.itemType === 'product')
    .map((i) => i.refId);
  const packageIds = parsed.data.items
    .filter((i) => i.itemType === 'package')
    .map((i) => i.refId);

  const [products, packages] = await Promise.all([
    Product.find({ _id: { $in: productIds } }).lean(),
    GiftPackage.find({ _id: { $in: packageIds } }).lean(),
  ]);

  const productById = new Map(products.map((p: any) => [p._id.toString(), p]));
  const packageById = new Map(packages.map((p: any) => [p._id.toString(), p]));

  const items = parsed.data.items
    .map((i) => {
      if (i.itemType === 'product') {
        const p: any = productById.get(i.refId);
        if (!p) return null;
        return {
          itemType: 'product',
          refId: p._id,
          name: p.name,
          image: p.images?.[0] ?? '',
          unitPrice: p.price,
          quantity: i.quantity,
        };
      }

      const pkg: any = packageById.get(i.refId);
      if (!pkg) return null;
      const unitPrice = applyDiscount(pkg.price, pkg.discountPercent);
      return {
        itemType: 'package',
        refId: pkg._id,
        name: pkg.name,
        image: pkg.image ?? '',
        unitPrice,
        quantity: i.quantity,
      };
    })
    .filter(Boolean);

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $set: { userId, items } },
    { upsert: true, new: true },
  ).lean();

  return NextResponse.json({
    items:
      cart?.items?.map((it: any) => ({
        itemType: it.itemType,
        refId: it.refId.toString(),
        name: it.name,
        image: it.image,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })) ?? [],
  });
}

export async function DELETE() {
  let userId: string;
  try {
    ({ userId } = await requireUser());
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;
  await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { upsert: true },
  );
  return NextResponse.json({ ok: true });
}
