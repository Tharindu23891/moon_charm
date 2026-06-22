import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { OccasionTile } from '@/components/occasion-tile';
import { PageHeader } from '@/components/page-header';

export const metadata = {
  title: 'Shop by occasion',
  description:
    'Find the right gift by occasion: birthdays, anniversaries, weddings, Valentine, baby, and more, curated by The Moon Charm.',
  alternates: { canonical: '/categories' },
};

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

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    await connectToDatabase();
    categories = await Category.find({}).sort({ name: 1 }).lean();
  } catch (error) {
    console.error('Failed to load categories from MongoDB', error);
  }

  const existingSlugs = new Set(categories.map((c: any) => c.slug));
  const merged = [
    ...categories.map((c: any) => ({ id: c._id.toString(), name: c.name, slug: c.slug })),
    ...defaults
      .map((name) => ({ id: `default-${name}`, name, slug: name.toLowerCase().replace(/\s+/g, '-') }))
      .filter((c) => !existingSlugs.has(c.slug)),
  ];

  return (
    <div className="mc-container py-12 md:py-16">
      <PageHeader
        eyebrow="Start with the moment"
        title="Shop by occasion"
        description="Whatever you’re marking, begin here. Each occasion leads to gifts chosen to suit it."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {merged.map((c) => (
          <OccasionTile key={c.id} name={c.name} slug={c.slug} />
        ))}
      </div>
    </div>
  );
}
