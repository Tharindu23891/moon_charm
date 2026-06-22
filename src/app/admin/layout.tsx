'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

const nav = [
  {
    href: '/admin',
    label: 'Overview',
    exact: true,
    d: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  },
  {
    href: '/admin/products',
    label: 'Products',
    d: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1-.6-1.4V5a1 1 0 0 1 1-1h7a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.4zM8 8h.01',
  },
  {
    href: '/admin/packages',
    label: 'Packages',
    d: 'M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    d: 'M3 7h7v5H3zM14 7h7v10h-7zM3 14h7v3H3z',
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    d: 'M5 4h11l3 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM8 11h8M8 15h6',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (item: (typeof nav)[number]) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className="mc-container mc-container-wide py-8 md:py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[218px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="px-3 text-xs font-semibold tracking-[0.14em] text-faint uppercase">
            Admin
          </p>
          <nav className="mt-3 flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {nav.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-[var(--r)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    active
                      ? 'bg-surface text-ink'
                      : 'text-muted-foreground hover:bg-surface hover:text-ink',
                  )}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className={cn(
                      'h-[1.05rem] w-[1.05rem]',
                      active ? 'text-primary' : 'text-faint',
                    )}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={item.d}
                    />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 hidden border-t border-line pt-4 lg:block">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-[var(--r)] px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15 18-6-6 6-6"
                />
              </svg>
              View store
            </Link>
          </div>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
