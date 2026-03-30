import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';

export default async function CategoriesPage() {
  await connectToDatabase();
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  const defaults = [
    'Birthday gifts',
    'Anniversary gifts',
    'Wedding gifts',
    'Valentine gifts',
    'Baby gifts',
    'Corporate gifts',
    'Custom gifts',
    'Other',
  ];

  const existingSlugs = new Set(categories.map((c: any) => c.slug));
  const merged = [
    ...categories.map((c: any) => ({ id: c._id.toString(), name: c.name, slug: c.slug })),
    ...defaults
      .map((name) => ({
        id: `default-${name}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
      }))
      .filter((c) => !existingSlugs.has(c.slug)),
  ];

  return (
    <div className="mc-container py-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="mc-text-gradient">Categories</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Click a category to filter products.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {merged.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${encodeURIComponent(c.slug)}`}
            className="mc-card-hover group p-5"
          >
            <div className="text-sm font-medium">{c.name}</div>
            <div className="mt-1 text-xs text-zinc-600 group-hover:text-zinc-700">View products</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
