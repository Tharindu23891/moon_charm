'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';
import { AdminHeader, AdminPanel } from '@/components/admin/admin-ui';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: { name: string; slug: string } | null;
};

export default function AdminProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        setProducts([]);
        const msg = (await res.json().catch(() => null))?.error ?? 'Failed to load products';
        toast.error(msg);
        return;
      }
      const data: unknown = await res.json().catch(() => null);
      if (!Array.isArray(data)) {
        setProducts([]);
        toast.error('Unexpected response from server');
        return;
      }
      setProducts(data as Product[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.status === 401) {
      toast.error('Please sign in as an admin to manage products');
      router.push('/login?next=/admin/products');
      return;
    }
    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Delete failed';
      toast.error(msg);
      return;
    }
    toast.success('Product deleted');
    await load();
  }

  let body: React.ReactNode;
  if (loading) {
    body = <p className="px-5 py-8 text-sm text-muted">Loading…</p>;
  } else if (products.length === 0) {
    body = (
      <div className="px-5 py-12 text-center">
        <p className="font-display text-lg text-ink">No products yet</p>
        <p className="mt-1 text-sm text-muted">Add your first gift to get started.</p>
        <Link href="/admin/products/new" className="mc-btn mt-5">Add product</Link>
      </div>
    );
  } else {
    body = (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-line bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Name</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 text-right font-semibold">Price</th>
              <th className="px-5 py-3 text-right font-semibold">Qty</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-surface/60">
                <td className="px-5 py-3.5 font-medium text-ink">{p.name}</td>
                <td className="px-5 py-3.5 text-muted">{p.category?.name ?? '—'}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-ink">{formatLkr(p.price)}</td>
                <td className="px-5 py-3.5 text-right tabular-nums text-muted">{p.stock}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="mc-btn-ghost h-9 px-3 text-sm">Edit</Link>
                    <button type="button" onClick={() => deleteProduct(p.id)} className="mc-btn-ghost h-9 px-3 text-sm text-muted hover:text-accent">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Products"
        description="Create, edit, and remove individual gift items."
        actions={<Link href="/admin/products/new" className="mc-btn">Add product</Link>}
      />
      <div className="mt-8">
        <AdminPanel>{body}</AdminPanel>
      </div>
    </div>
  );
}
