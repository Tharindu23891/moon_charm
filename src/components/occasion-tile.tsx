import Link from 'next/link';
import { MoonMark } from '@/components/moon-mark';

export function OccasionTile({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(slug)}`}
      className="group flex min-h-[160px] flex-col justify-between rounded-[var(--r-lg)] border border-line bg-bg p-6 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[var(--shadow)]"
    >
      <span className="h-6 w-6 text-primary transition-transform duration-500 group-hover:-rotate-12">
        <MoonMark />
      </span>
      <div>
        <h3 className="font-display text-xl leading-tight">{name}</h3>
        <span className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-primary">
          Browse gifts
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
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
