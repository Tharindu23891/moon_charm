import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { Suspense } from 'react';
import { ProductCard, type ProductListItem } from '@/components/product/product-card';
import { PageHeader } from '@/components/page-header';
import { ProductFilters } from '@/components/product-filters';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Shop all gifts' };

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<Record<string, string | string[] | undefined>> }>) {
  const sp = await searchParams;
  const q = getParam(sp, 'q') ?? '';
  const category = getParam(sp, 'category') ?? '';
  const minPrice = getParam(sp, 'minPrice') ?? '';
  const maxPrice = getParam(sp, 'maxPrice') ?? '';
  const sort = getParam(sp, 'sort') ?? 'newest';

  let categories: any[] = [];
  let list: ProductListItem[] = [];
  let databaseUnavailable = false;

  try {
    await connectToDatabase();
    categories = await Category.find({}).sort({ name: 1 }).lean();

    const filter: any = {};
    if (q) filter.$text = { $search: q };
    if (category) {
      const cat = categories.find((c: any) => c.slug === category);
      if (cat) filter.categoryId = cat._id;
    }
    const priceFilter: any = {};
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      popularity: { popularity: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };

    const products = await Product.find(filter)
      .select('name shortDescription price images stock categoryId')
      .sort(sortMap[sort] ?? sortMap.newest)
      .limit(200)
      .populate({ path: 'categoryId', select: 'name slug' })
      .lean();

    list = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      shortDescription: p.shortDescription,
      price: p.price,
      images: p.images ?? [],
      stock: p.stock,
      category: p.categoryId ? { name: p.categoryId.name, slug: p.categoryId.slug } : null,
    }));
  } catch (error) {
    databaseUnavailable = true;
    console.error('Failed to load products page data from MongoDB', error);
  }

  const activeCategory = categories.find((c: any) => c.slug === category);
  const hasFilters = Boolean(q || category || minPrice || maxPrice || sort !== 'newest');
  const filterCategories = categories.map((c: any) => ({ id: c._id.toString(), name: c.name, slug: c.slug }));

  return (
    <div className="mc-container py-12 md:py-16">
      <PageHeader
        eyebrow="The shop"
        title="Every gift, in one place"
        description="Browse individual pieces. Filter by occasion, price, or search for something specific."
      />

      <div className="mt-8">
        <Suspense fallback={<div className="h-36 animate-pulse rounded-[var(--r-lg)] border border-line bg-surface" />}>
          <ProductFilters categories={filterCategories} />
        </Suspense>
      </div>

      {databaseUnavailable ? (
        <p className="mt-6 rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-sm text-muted-foreground">
          Our catalog is briefly unavailable while we reconnect. Please try again in a moment.
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {list.length} {list.length === 1 ? 'gift' : 'gifts'}
          {activeCategory ? <> in <span className="text-ink">{activeCategory.name}</span></> : null}
        </p>
      </div>

      {list.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--r-lg)] border border-dashed border-line-strong bg-surface px-6 py-16 text-center">
          <p className="font-display text-xl text-ink">Nothing matches yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Try a broader search, or clear the filters to see everything.</p>
          {hasFilters ? (
            <Button asChild variant="outline" className="mt-5"><Link href="/products">Clear filters</Link></Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
