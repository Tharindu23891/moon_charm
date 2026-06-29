import Image from 'next/image';
import Link from 'next/link';
import { MoonMark } from '@/components/moon-mark';

const OCCASION_IMAGES: Record<string, string> = {
  'birthday-gifts': '/occasions/birthday_gifts.jpg',
  'anniversary-gifts': '/occasions/Anniversary gifts.jpg',
  'wedding-gifts': '/occasions/wedding_gifts.jpg',
  'valentine-gifts': '/occasions/Valentine gifts.jpg',
  'baby-gifts': '/occasions/baby_gifts.jpg',
  'corporate-gifts': '/occasions/Corporate gifts.jpg',
  'custom-gifts': '/occasions/customs gifts.jpg',
  'other': '/occasions/others.jpg',
};

export function OccasionTile({
  name,
  slug,
  image,
}: {
  name: string;
  slug: string;
  image?: string;
}) {
  const imageUrl = image || OCCASION_IMAGES[slug] || OCCASION_IMAGES['other'];

  return (
    <Link
      href={`/products?category=${encodeURIComponent(slug)}`}
      className="group flex flex-col rounded-[var(--r-lg)] border border-line bg-bg p-2 sm:p-3 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--r-sm)] sm:rounded-[var(--r)] bg-surface">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 250px"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between px-1 sm:px-2 pt-3 sm:pt-4 pb-1 sm:pb-2">
        <div className="flex items-start justify-between gap-1.5 sm:gap-3">
          <h3 className="font-display text-[15px] sm:text-lg font-medium leading-snug text-ink group-hover:text-primary transition-colors">
            {name}
          </h3>
          <span className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 transition-transform duration-500 group-hover:-rotate-12">
            <MoonMark />
          </span>
        </div>
        <span className="mt-3 sm:mt-4 inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-primary">
          Browse gifts
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
