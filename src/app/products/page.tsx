import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { ProductCard, type ProductListItem } from '@/components/product/product-card';

function getParam(
  searchParams: Record<string, string | string[] | undefined>,
  key: string
) {
  const v = searchParams[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = getParam(sp, 'q') ?? '';
  const category = getParam(sp, 'category') ?? '';
  const minPrice = getParam(sp, 'minPrice') ?? '';
  const maxPrice = getParam(sp, 'maxPrice') ?? '';
  const sort = getParam(sp, 'sort') ?? 'newest';

  await connectToDatabase();

  const categories = await Category.find({}).sort({ name: 1 }).lean();

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
    .sort(sortMap[sort] ?? sortMap.newest)
    .limit(200)
    .populate('categoryId')
    .lean();

  const list: ProductListItem[] = products.map((p: any) => ({
    id: p._id.toString(),
    name: p.name,
    shortDescription: p.shortDescription,
    price: p.price,
    images: p.images ?? [],
    stock: p.stock,
    category: p.categoryId ? { name: p.categoryId.name, slug: p.categoryId.slug } : null,
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Browse individual gift items.
          </p>
        </div>
        <Link href="/categories" className="text-sm text-neutral-700 hover:text-neutral-900">
          Browse categories
        </Link>
      </div>

      <form className="mt-6 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-12">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search gifts..."
          className="md:col-span-4 rounded-lg border px-3 py-2 text-sm"
        />

        <select
          name="category"
          defaultValue={category}
          className="md:col-span-3 rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c: any) => (
            <option key={c._id.toString()} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          name="minPrice"
          defaultValue={minPrice}
          placeholder="Min price"
          inputMode="decimal"
          className="md:col-span-2 rounded-lg border px-3 py-2 text-sm"
        />
        <input
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="Max price"
          inputMode="decimal"
          className="md:col-span-2 rounded-lg border px-3 py-2 text-sm"
        />

        <select
          name="sort"
          defaultValue={sort}
          className="md:col-span-1 rounded-lg border px-3 py-2 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>

        <div className="md:col-span-12 flex items-center justify-end gap-2">
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Apply
          </button>
          <Link
            href="/products"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Reset
          </Link>
        </div>
      </form>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center text-sm text-neutral-600">
          No products found.
        </div>
      ) : null}
    </div>
  );
}
