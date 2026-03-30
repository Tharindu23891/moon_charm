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
}: Readonly<{
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
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
    .select('name shortDescription price images stock categoryId')
    .sort(sortMap[sort] ?? sortMap.newest)
    .limit(200)
    .populate({ path: 'categoryId', select: 'name slug' })
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
    <div className="mc-container py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Products</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Browse individual gift items.
          </p>
        </div>
        <Link href="/categories" className="mc-pill hover:bg-white">
          Browse categories
        </Link>
      </div>

      <form className="mc-card mt-6 grid gap-3 p-4 md:grid-cols-12">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search gifts..."
          className="mc-input md:col-span-4"
        />

        <select
          name="category"
          defaultValue={category}
          className="mc-input md:col-span-3"
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
          className="mc-input md:col-span-2"
        />
        <input
          name="maxPrice"
          defaultValue={maxPrice}
          placeholder="Max price"
          inputMode="decimal"
          className="mc-input md:col-span-2"
        />

        <select
          name="sort"
          defaultValue={sort}
          className="mc-input md:col-span-1"
        >
          <option value="newest">Newest</option>
          <option value="popularity">Popularity</option>
          <option value="price-asc">Price ↑</option>
          <option value="price-desc">Price ↓</option>
        </select>

        <div className="md:col-span-12 flex items-center justify-end gap-2">
          <button
            type="submit"
            className="mc-btn"
          >
            Apply
          </button>
          <Link
            href="/products"
            className="mc-btn-outline"
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
        <div className="mc-card mt-10 p-8 text-center text-sm text-zinc-600">
          No products found.
        </div>
      ) : null}
    </div>
  );
}
