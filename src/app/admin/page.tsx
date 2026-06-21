import Link from 'next/link';
import { AdminHeader } from '@/components/admin/admin-ui';

const sections = [
  { href: '/admin/products', title: 'Products', desc: 'Add, edit, and remove individual gift items.', d: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-6.2-6.2a2 2 0 0 1-.6-1.4V5a1 1 0 0 1 1-1h7a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.4zM8 8h.01' },
  { href: '/admin/packages', title: 'Packages', desc: 'Bundle products into ready-to-give gift packages.', d: 'M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8' },
  { href: '/admin/categories', title: 'Categories', desc: 'Manage the occasions gifts are organised under.', d: 'M3 7h7v5H3zM14 7h7v10h-7zM3 14h7v3H3z' },
  { href: '/admin/orders', title: 'Orders', desc: 'Review orders and move them through fulfilment.', d: 'M5 4h11l3 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM8 11h8M8 15h6' },
];

export default function AdminHomePage() {
  return (
    <div>
      <AdminHeader title="Dashboard" description="Manage the catalogue and keep orders moving." />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex items-start gap-4 rounded-[var(--r-lg)] border border-line bg-bg p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[var(--shadow)]"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--r)] bg-surface text-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={s.d} />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-1.5 font-display text-lg">
                {s.title}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </div>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
