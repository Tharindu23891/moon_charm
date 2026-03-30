'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';

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
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.status === 401) {
      toast.error('Please log in as admin to manage products');
      router.push('/login?next=/admin/products');
      return;
    }
    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Delete failed';
      toast.error(msg);
      return;
    }
    toast.success('Deleted');
    await load();
  }

  let body: React.ReactNode;
  if (loading) {
    body = <div className="p-4 text-sm text-zinc-600">Loading…</div>;
  } else if (products.length === 0) {
    body = <div className="p-4 text-sm text-zinc-600">No products.</div>;
  } else {
    body = (
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/50 bg-white/40 text-xs text-zinc-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-white/50 last:border-0 hover:bg-white/35">
              <td className="px-4 py-3 font-medium text-zinc-900">{p.name}</td>
              <td className="px-4 py-3 text-zinc-700">{p.category?.name ?? '—'}</td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-900">{formatLkr(p.price)}</td>
              <td className="px-4 py-3 text-right tabular-nums text-zinc-900">{p.stock}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center justify-end gap-2">
                  <Link href={`/admin/products/${p.id}`} className="mc-btn-outline">
                    Edit
                  </Link>
                  <button type="button" onClick={() => deleteProduct(p.id)} className="mc-btn-outline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="mc-container py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Admin · Products</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">Create, edit, and delete products.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="mc-btn">
            Add product
          </Link>
          <Link href="/admin" className="mc-pill hover:bg-white">
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mc-card mt-6 overflow-hidden p-0">
        <div className="border-b border-white/50 p-4 text-sm font-medium">Products</div>
        {body}
      </div>
    </div>
  );
}
