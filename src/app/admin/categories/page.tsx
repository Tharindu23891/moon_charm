'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

type Category = { id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const cats = await fetch('/api/categories').then((r) => r.json());
    setCategories(cats);
  }

  useEffect(() => {
    load();
  }, []);

  async function createCategory() {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Create failed';
      toast.error(msg);
      return;
    }

    toast.success('Category created');
    setName('');
    await load();
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Deleted');
    await load();
  }

  return (
    <div className="mc-container max-w-4xl py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="mc-text-gradient">Admin · Categories</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-600">Create and manage categories.</p>
        </div>
        <Link href="/admin" className="mc-pill hover:bg-white">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="mc-card p-5">
          <div className="text-sm font-medium">Add category</div>
          <div className="mt-4 flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
              className="mc-input flex-1"
            />
            <button
              type="button"
              onClick={createCategory}
              disabled={!name.trim()}
              className="mc-btn disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </div>

        <div className="mc-card overflow-hidden p-0">
          <div className="border-b border-white/50 p-4 text-sm font-medium">Categories</div>
          <div className="divide-y">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="mt-1 text-xs text-zinc-600">{c.slug}</div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(c.id)}
                  className="mc-btn-outline"
                >
                  Delete
                </button>
              </div>
            ))}
            {categories.length === 0 ? (
              <div className="p-4 text-sm text-zinc-600">No categories.</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
