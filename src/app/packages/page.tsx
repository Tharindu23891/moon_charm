import { connectToDatabase } from '@/lib/mongoose';
import { GiftPackage } from '@/models/GiftPackage';
import { PackageCard, type PackageListItem } from '@/components/package/package-card';

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) ?? 'newest';

  await connectToDatabase();

  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    popularity: { popularity: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
  };

  const packages = await GiftPackage.find({})
    .sort(sortMap[sort] ?? sortMap.newest)
    .limit(200)
    .populate('items.productId')
    .lean();

  const list: PackageListItem[] = packages.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
    image: p.image,
    price: p.price,
    discountPercent: p.discountPercent ?? null,
    items: (p.items ?? []).map((it: any) => ({
      name: it.productId?.name ?? null,
      quantity: it.quantity,
    })),
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Packages</h1>
        <p className="mt-1 text-sm text-neutral-600">Curated bundles and gift boxes.</p>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <form>
          <select
            name="sort"
            defaultValue={sort}
            className="rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
          <button
            type="submit"
            className="ml-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PackageCard key={p.id} pkg={p} />
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center text-sm text-neutral-600">
          No packages found.
        </div>
      ) : null}
    </div>
  );
}
