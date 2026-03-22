'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

type Product = { id: string; name: string };

type Package = {
  id: string;
  name: string;
  price: number;
  discountPercent?: number | null;
  items: { productId: string; name?: string | null; quantity: number }[];
};

export default function AdminPackagesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    price: '0',
    discountPercent: '',
    image: '',
    productId: '',
    quantity: '1',
    items: [] as { productId: string; quantity: number }[],
  });

  const canSubmit = useMemo(() => {
    return form.name.trim().length > 0 && Number(form.price) >= 0;
  }, [form.name, form.price]);

  async function load() {
    setLoading(true);
    try {
      const [prods, pkgs] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/packages').then((r) => r.json()),
      ]);
      setProducts(prods.map((p: any) => ({ id: p.id, name: p.name })));
      setPackages(pkgs);
      if (!form.productId && prods?.[0]?.id) {
        setForm((f) => ({ ...f, productId: prods[0].id }));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addItem() {
    if (!form.productId) return;
    const qty = Math.max(1, Number(form.quantity) || 1);
    setForm((f) => ({
      ...f,
      items: [...f.items, { productId: f.productId, quantity: qty }],
    }));
  }

  async function createPackage() {
    if (!canSubmit) return;

    const discountPercent = form.discountPercent.trim() ? Number(form.discountPercent) : undefined;

    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        discountPercent,
        image: form.image,
        items: form.items,
      }),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Create failed';
      toast.error(msg);
      return;
    }

    toast.success('Package created');
    setForm((f) => ({ ...f, name: '', image: '', items: [] }));
    await load();
  }

  async function deletePackage(id: string) {
    if (!confirm('Delete this package?')) return;
    const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-semibold tracking-tight">Admin · Packages</h1>
          <p className="mt-1 text-sm text-neutral-600">Create and manage packages.</p>
        </div>
        <Link href="/admin" className="text-sm text-neutral-700 hover:text-neutral-900">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm font-medium">Add package</div>
          <div className="mt-4 grid gap-3">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
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
                value={form.discountPercent}
                onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))}
                placeholder="Discount % (optional)"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="Image URL (optional)"
              className="rounded-lg border px-3 py-2 text-sm"
            />

            <div className="rounded-xl border p-3">
              <div className="text-sm font-medium">Included items</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <select
                  value={form.productId}
                  onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  placeholder="Qty"
                  inputMode="numeric"
                  className="w-24 rounded-lg border px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
                >
                  Add item
                </button>
              </div>
              <div className="mt-3 text-sm text-neutral-700">
                {form.items.length === 0 ? (
                  <div className="text-neutral-600">No items added.</div>
                ) : (
                  <ul className="space-y-1">
                    {form.items.map((it, idx) => (
                      <li key={idx}>
                        {it.quantity}× {products.find((p) => p.id === it.productId)?.name ?? it.productId}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={createPackage}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-300"
            >
              Create
            </button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white">
          <div className="border-b p-4 text-sm font-medium">Packages</div>
          {loading ? (
            <div className="p-4 text-sm text-neutral-600">Loading…</div>
          ) : packages.length === 0 ? (
            <div className="p-4 text-sm text-neutral-600">No packages.</div>
          ) : (
            <div className="divide-y">
              {packages.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      ${p.price.toFixed(2)}{p.discountPercent ? ` · ${p.discountPercent}% off` : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deletePackage(p.id)}
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
