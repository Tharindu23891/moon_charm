import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { GiftPackage } from '@/models/GiftPackage';
import { ProductCard } from '@/components/product/product-card';
import { PackageCard } from '@/components/package/package-card';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/reveal';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { MoonMark } from '@/components/moon-mark';
import { OccasionTile } from '@/components/occasion-tile';
import { CharmArt } from '@/components/art/charm-art';
import { Button } from '@/components/ui/button';

export const metadata = {
  alternates: { canonical: '/' },
};

const trustPoints = [
  'Hand-assembled packages',
  'Island-wide delivery',
  'A handwritten gift note',
  'Made in Kuliyapitiya',
];

const testimonials = [
  {
    quote:
      'It arrived wrapped so beautifully my sister thought I had it flown in. I did not. It came from Kuliyapitiya.',
    name: 'Ayesha K.',
    place: 'Colombo',
  },
  {
    quote:
      'I ordered from abroad for my parents’ anniversary. They sent me photos the moment it landed. Perfect.',
    name: 'Mark L.',
    place: 'London',
  },
  {
    quote:
      'Every detail was considered, down to the note card. This is now my go-to for the people I care about.',
    name: 'Priya S.',
    place: 'Kandy',
  },
];

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let featuredPackages: any[] = [];
  let categories: any[] = [];

  try {
    await connectToDatabase();
    [featuredProducts, featuredPackages, categories] = await Promise.all([
      Product.find({ isFeatured: true })
        .sort({ popularity: -1 })
        .limit(6)
        .populate('categoryId')
        .lean(),
      GiftPackage.find({ isFeatured: true })
        .sort({ popularity: -1 })
        .limit(6)
        .populate('items.productId')
        .lean(),
      Category.find({}).sort({ name: 1 }).limit(8).lean(),
    ]);
  } catch (error) {
    console.error('Failed to load homepage data from MongoDB', error);
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mc-container grid items-center gap-12 pt-8 pb-14 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-24">
          <Stagger className="max-w-xl">
            <StaggerItem as="span" className="mc-eyebrow block">
              A gift house · Sri Lanka
            </StaggerItem>
            <StaggerItem
              as="h1"
              className="mc-display mt-5 text-[clamp(2.75rem,6vw,5rem)]"
            >
              Gifts made to be{' '}
              <span className="text-primary italic">remembered</span>.
            </StaggerItem>
            <StaggerItem
              as="p"
              className="mc-prose mt-6 text-[1.15rem] leading-relaxed text-muted-foreground"
            >
              We assemble each package by hand and send it island-wide, so the
              thought you put in is exactly what arrives at the door.
            </StaggerItem>
            <StaggerItem className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/products">Shop gifts</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/packages">Explore gift packages</Link>
              </Button>
            </StaggerItem>
            <StaggerItem as="p" className="mt-7 text-sm text-faint">
              Hand-wrapped · Gift note included · Delivered anywhere in Sri
              Lanka
            </StaggerItem>
          </Stagger>

          <Reveal className="relative" delay={200}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-xl)] bg-espresso shadow-[var(--shadow-lg)]">
              <CharmArt variant="hero" className="absolute inset-0" />
            </div>
            <div className="absolute -bottom-5 left-5 hidden items-center gap-3 rounded-[var(--r)] border border-line bg-bg px-4 py-3 shadow-[var(--shadow)] sm:flex">
              <span className="h-7 w-7 text-primary">
                <MoonMark />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink">
                  Wrapped by hand
                </p>
                <p className="text-xs text-muted-foreground">
                  Every single order
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Trust strip */}
        <div className="border-y border-line bg-surface">
          <div className="mc-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-sm text-muted-foreground">
            {trustPoints.map((point, i) => (
              <span key={point} className="flex items-center gap-x-8">
                {point}
                {i < trustPoints.length - 1 ? (
                  <span aria-hidden className="text-line-strong">
                    ·
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured gifts */}
      <section className="mc-container mc-section">
        <Reveal>
          <SectionHeading
            title="A few favourites"
            description="Individual pieces, chosen for how they feel to give and to receive."
            action={{ href: '/products', label: 'View all gifts' }}
          />
        </Reveal>

        {featuredProducts.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3">
            {featuredProducts.map((p, i) => (
              <Reveal key={p._id.toString()} delay={(i % 3) * 80}>
                <ProductCard
                  product={{
                    id: p._id.toString(),
                    name: p.name,
                    shortDescription: p.shortDescription,
                    price: p.price,
                    images: p.images ?? [],
                    stock: p.stock,
                    category: p.categoryId
                      ? { name: p.categoryId.name, slug: p.categoryId.slug }
                      : null,
                  }}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyNote>
            No featured gifts yet. Run the seed script to populate the catalog.
          </EmptyNote>
        )}
      </section>

      {/* Featured packages */}
      <section className="bg-surface-warm">
        <div className="mc-container mc-section">
          <Reveal>
            <SectionHeading
              kicker="Ready to give"
              title="Gift packages, assembled for you"
              description="Thoughtful bundles at a gentler price than buying each piece on its own."
              action={{ href: '/packages', label: 'View all packages' }}
            />
          </Reveal>

          {featuredPackages.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-3">
              {featuredPackages.map((p, i) => (
                <Reveal key={p._id.toString()} delay={(i % 3) * 80}>
                  <PackageCard
                    pkg={{
                      id: p._id.toString(),
                      name: p.name,
                      image: p.image,
                      price: p.price,
                      discountPercent: p.discountPercent ?? null,
                      items: (p.items ?? []).map((it: any) => ({
                        name: it.productId?.name ?? null,
                        quantity: it.quantity,
                      })),
                    }}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyNote>
              No featured packages yet. Run the seed script to add bundles.
            </EmptyNote>
          )}
        </div>
      </section>

      {/* Shop by occasion */}
      <section className="mc-container mc-section">
        <Reveal>
          <SectionHeading
            title="Shop by occasion"
            description="Start with the moment. We will help you find the gift that fits it."
            action={{ href: '/categories', label: 'All occasions' }}
          />
        </Reveal>

        {categories.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c._id.toString()} delay={(i % 4) * 70}>
                <OccasionTile name={c.name} slug={c.slug} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyNote>
            No occasions yet. Run the seed script to add categories.
          </EmptyNote>
        )}
      </section>

      {/* Brand story */}
      <section className="mc-container mc-section pt-0">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <span className="mc-eyebrow">Our promise</span>
            <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
              A small house that takes the gift personally
            </h2>
            <div className="mc-prose mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted-foreground">
              <p>
                The Moon Charm began at a kitchen table in Kuliyapitiya,
                wrapping chocolate bouquets for friends. We still work the same
                way: a person chooses the pieces, folds the paper, ties the
                ribbon, and writes your note by hand.
              </p>
              <p>
                Nothing is mass-produced and nothing is rushed. When it leaves
                us, it looks like someone cared, because someone did.
              </p>
            </div>
            <Link
              href="/about"
              className="group mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-primary"
            >
              Read our story
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          </Reveal>

          <Reveal className="order-1 lg:order-2">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--r-xl)] bg-espresso shadow-[var(--shadow)]">
              <CharmArt variant="story" className="absolute inset-0" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-espresso text-on-dark">
        <div className="mc-container mc-section">
          <Reveal>
            <SectionHeading
              title={<span className="text-on-dark">Kind words</span>}
              description={
                <span className="text-on-dark/70">
                  From people who sent something that mattered.
                </span>
              }
            />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <figure className="flex h-full flex-col">
                  <span
                    aria-hidden
                    className="font-display text-5xl leading-none text-primary"
                  >
                    “
                  </span>
                  <blockquote className="mt-3 flex-1 font-display text-[1.3rem] leading-snug text-on-dark">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 text-sm text-on-dark/65">
                    <span className="font-semibold text-on-dark">{t.name}</span>{' '}
                    · {t.place}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mc-container mc-section">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-[var(--r-xl)] border border-line bg-surface px-6 py-14 text-center">
            <span className="h-9 w-9 text-primary">
              <MoonMark />
            </span>
            <h2 className="max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">
              Not sure what to give? Tell us about them.
            </h2>
            <p className="mc-prose text-muted-foreground">
              Send us the occasion and the person, and we will put together
              something that suits.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/contact">Ask for a recommendation</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/packages">Browse packages</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-10 rounded-[var(--r-lg)] border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
