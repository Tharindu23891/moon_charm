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
    <div className="mc-container py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="mc-text-gradient">Packages</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-600">Curated bundles and gift boxes.</p>
      </div>

      <div className="mt-6 flex items-center justify-end">
        <form>
          <select
            name="sort"
            defaultValue={sort}
            className="mc-input"
          >
            <option value="newest">Newest</option>
            <option value="popularity">Popularity</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
          <button
            type="submit"
            className="mc-btn ml-2"
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
        <div className="mc-card mt-10 p-8 text-center text-sm text-zinc-600">
          No packages found.
        </div>
      ) : null}
    </div>
  );
}
