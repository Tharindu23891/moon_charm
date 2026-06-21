import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductCard, type ProductListItem } from '@/components/product/product-card';
import { PageHeader } from '@/components/page-header';

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
  const fieldClass = 'mc-input h-11';

  return (
    <div className="mc-container py-12 md:py-16">
      <PageHeader
        eyebrow="The shop"
        title="Every gift, in one place"
        description="Browse individual pieces. Filter by occasion, price, or search for something specific."
      />

      <form className="mt-8 rounded-[var(--r-lg)] border border-line bg-surface p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_1fr]">
          <label className="block">
            <span className="sr-only">Search gifts</span>
            <input name="q" defaultValue={q} placeholder="Search gifts…" className={fieldClass} />
          </label>
          <label className="block">
            <span className="sr-only">Category</span>
            <select name="category" defaultValue={category} className={`${fieldClass} mc-select`}>
              <option value="">All occasions</option>
              {categories.map((c: any) => (
                <option key={c._id.toString()} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">Minimum price</span>
            <input name="minPrice" defaultValue={minPrice} placeholder="Min" inputMode="decimal" className={fieldClass} />
          </label>
          <label className="block">
            <span className="sr-only">Maximum price</span>
            <input name="maxPrice" defaultValue={maxPrice} placeholder="Max" inputMode="decimal" className={fieldClass} />
          </label>
          <label className="block">
            <span className="sr-only">Sort by</span>
            <select name="sort" defaultValue={sort} className={`${fieldClass} mc-select`}>
              <option value="newest">Newest first</option>
              <option value="popularity">Most loved</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          {hasFilters ? (
            <Link href="/products" className="mc-btn-ghost h-11">Reset</Link>
          ) : null}
          <button type="submit" className="mc-btn h-11">Apply filters</button>
        </div>
      </form>

      {databaseUnavailable ? (
        <p className="mt-6 rounded-[var(--r)] border border-line bg-surface px-4 py-3 text-sm text-muted">
          Our catalog is briefly unavailable while we reconnect. Please try again in a moment.
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
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
          <p className="mt-2 text-sm text-muted">Try a broader search, or clear the filters to see everything.</p>
          {hasFilters ? (
            <Link href="/products" className="mc-btn-outline mt-5">Clear filters</Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
