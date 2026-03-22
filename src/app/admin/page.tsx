import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">Manage catalog and orders.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[{
          href: '/admin/products',
          title: 'Products',
          desc: 'Add, edit, and delete products.',
        },
        {
          href: '/admin/packages',
          title: 'Packages',
          desc: 'Create and manage gift bundles.',
        },
        {
          href: '/admin/categories',
          title: 'Categories',
          desc: 'Manage category list.',
        },
        {
          href: '/admin/orders',
          title: 'Orders',
          desc: 'View and update order status.',
        }].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border bg-white p-5 hover:bg-neutral-50"
          >
            <div className="text-sm font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-neutral-600">{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
