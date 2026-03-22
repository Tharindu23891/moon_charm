'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

type Category = { id: string; name: string; slug: string };

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: { name: string; slug: string } | null;
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '0',
    stock: '0',
    categorySlug: '',
    images: '',
  });

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.shortDescription.trim().length > 0 &&
      form.description.trim().length > 0 &&
      Number(form.price) >= 0 &&
      Number(form.stock) >= 0 &&
      form.categorySlug.trim().length > 0
    );
  }, [form]);

  async function load() {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
      ]);
      setCategories(cats);
      setProducts(prods);
      if (!form.categorySlug && cats?.[0]?.slug) {
        setForm((f) => ({ ...f, categorySlug: cats[0].slug }));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createProduct() {
    if (!canSubmit) return;

    const images = form.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        shortDescription: form.shortDescription,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categorySlug: form.categorySlug,
        images,
      }),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Create failed';
      toast.error(msg);
      return;
    }

    toast.success('Product created');
    setForm((f) => ({ ...f, name: '', shortDescription: '', description: '', images: '' }));
    await load();
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Deleted');
    await load();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin · Products</h1>
          <p className="mt-1 text-sm text-neutral-600">Create and manage products.</p>
        </div>
        <Link href="/admin" className="text-sm text-neutral-700 hover:text-neutral-900">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm font-medium">Add product</div>
          <div className="mt-4 grid gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={form.shortDescription}
              onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              placeholder="Short description"
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Full description"
              rows={4}
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="Price"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2 text-sm"
              />
              <input
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="Stock"
                inputMode="numeric"
                className="rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <select
              value={form.categorySlug}
              onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              value={form.images}
              onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
              placeholder="Images (comma-separated URLs)"
              className="rounded-lg border px-3 py-2 text-sm"
            />

            <button
              type="button"
              disabled={!canSubmit}
              onClick={createProduct}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300"
            >
              Create
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white">
          <div className="border-b p-4 text-sm font-medium">Products</div>
          {loading ? (
            <div className="p-4 text-sm text-neutral-600">Loading…</div>
          ) : products.length === 0 ? (
            <div className="p-4 text-sm text-neutral-600">No products.</div>
          ) : (
            <div className="divide-y">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      {p.category?.name ?? '—'} · ${p.price.toFixed(2)} · Stock {p.stock}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
