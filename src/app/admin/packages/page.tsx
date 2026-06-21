'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { formatLkr } from '@/lib/money';
import { AdminHeader, AdminPanel, AdminField } from '@/components/admin/admin-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/confirm-dialog';

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

  const canSubmit = useMemo(() => form.name.trim().length > 0 && Number(form.price) >= 0, [form.name, form.price]);

  async function load() {
    setLoading(true);
    try {
      const [prods, pkgs] = await Promise.all([
        fetch('/api/products').then((r) => r.json()),
        fetch('/api/packages').then((r) => r.json()),
      ]);
      setProducts((prods as any[]).map((p) => ({ id: p.id, name: p.name })));
      setPackages(pkgs);
      if (!form.productId && prods?.[0]?.id) setForm((f) => ({ ...f, productId: prods[0].id }));
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
    setForm((f) => ({ ...f, items: [...f.items, { productId: f.productId, quantity: qty }] }));
  }

  function removeItem(index: number) {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== index) }));
  }

  async function createPackage() {
    if (!canSubmit) return;
    const discountPercent = form.discountPercent.trim() ? Number(form.discountPercent) : undefined;
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, price: Number(form.price), discountPercent, image: form.image, items: form.items }),
    });
    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Create failed';
      toast.error(msg);
      return;
    }
    toast.success('Package created');
    setForm((f) => ({ ...f, name: '', image: '', discountPercent: '', items: [] }));
    await load();
  }

  async function deletePackage(id: string) {
    const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Package deleted');
    await load();
  }

  return (
    <div>
      <AdminHeader title="Packages" description="Bundle products into ready-to-give gift packages." />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Add a package" bodyClassName="grid gap-4 p-5">
          <AdminField label="Name">
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Birthday Surprise Box" />
          </AdminField>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Price (LKR)">
              <Input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} inputMode="decimal" />
            </AdminField>
            <AdminField label="Discount %" hint="Optional">
              <Input value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} inputMode="decimal" />
            </AdminField>
          </div>
          <AdminField label="Image URL" hint="Optional">
            <Input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://…" />
          </AdminField>

          <div className="rounded-[var(--r)] border border-line bg-surface p-4">
            <p className="text-sm font-semibold text-ink">Included items</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Select value={form.productId || undefined} onValueChange={(v) => setForm((f) => ({ ...f, productId: v }))}>
                <SelectTrigger className="w-full flex-1 sm:w-auto">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} placeholder="Qty" inputMode="numeric" className="w-20" />
              <Button type="button" variant="outline" onClick={addItem} className="shrink-0">Add</Button>
            </div>
            <div className="mt-3 text-sm">
              {form.items.length === 0 ? (
                <p className="text-faint">No items added yet.</p>
              ) : (
                <ul className="space-y-1.5">
                  {form.items.map((it, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-2 text-ink">
                      <span>{it.quantity}× {products.find((p) => p.id === it.productId)?.name ?? it.productId}</span>
                      <button type="button" onClick={() => removeItem(idx)} aria-label="Remove item" className="text-faint transition-colors hover:text-claret">×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <Button type="button" disabled={!canSubmit} onClick={createPackage}>Create package</Button>
        </AdminPanel>

        <AdminPanel title={`Packages (${packages.length})`}>
          {loading ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">Loading…</p>
          ) : packages.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">No packages yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {packages.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatLkr(p.price)}{p.discountPercent ? ` · ${p.discountPercent}% off` : ''}
                    </p>
                  </div>
                  <ConfirmDialog
                    title="Delete this package?"
                    description={`“${p.name}” will be removed.`}
                    confirmLabel="Delete package"
                    onConfirm={() => deletePackage(p.id)}
                    trigger={<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-claret">Delete</Button>}
                  />
                </li>
              ))}
            </ul>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
