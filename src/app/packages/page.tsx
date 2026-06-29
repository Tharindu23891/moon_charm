import { Suspense } from 'react';
import { connectToDatabase } from '@/lib/mongoose';
import { GiftPackage } from '@/models/GiftPackage';
import {
  PackageCard,
  type PackageListItem,
} from '@/components/package/package-card';
import { PageHeader } from '@/components/page-header';
import { SortSelect } from '@/components/sort-select';

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popularity', label: 'Most loved' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export const metadata = {
  title: 'Gift packages',
  description:
    'Curated gift packages from THE MOON CHARM, hand-assembled and wrapped as one considered gift for birthdays, anniversaries, weddings, and more.',
  alternates: { canonical: '/packages' },
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = (Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) ?? 'newest';

  let list: PackageListItem[] = [];
  let databaseUnavailable = false;

  try {
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

    list = packages.map((p: any) => ({
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
  } catch (error) {
    databaseUnavailable = true;
    console.error('Failed to load packages page data from MongoDB', error);
  }

  return (
    <div className="mc-container py-12 md:py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          eyebrow="Ready to give"
          title="Gift packages"
          description="Hand-assembled bundles, wrapped as a single gift and priced a little gentler than buying each piece alone."
        />
        <div className="shrink-0">
          <Suspense
            fallback={
              <div className="h-11 w-full rounded-[var(--r)] border border-line bg-surface sm:w-56" />
            }
          >
            <SortSelect
              options={sortOptions}
              defaultValue="newest"
              label="Sort packages"
              className="w-full sm:w-56"
            />
          </Suspense>
        </div>
      </div>

      {databaseUnavailable ? (
        <p className="mt-6 rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-sm text-muted-foreground">
          Packages are briefly unavailable while we reconnect. Please try again
          in a moment.
        </p>
      ) : null}

      {list.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[var(--r-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">No packages just yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            New bundles are added often. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
