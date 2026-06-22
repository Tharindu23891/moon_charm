'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdminHeader, AdminPanel } from '@/components/admin/admin-ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';

type Category = { id: string; name: string; slug: string };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const cats = await fetch('/api/categories').then((r) => r.json());
    setCategories(Array.isArray(cats) ? cats : []);
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
      const msg =
        (await res.json().catch(() => null))?.error ?? 'Create failed';
      toast.error(msg);
      return;
    }
    toast.success('Category created');
    setName('');
    await load();
  }

  async function deleteCategory(id: string) {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Category deleted');
    await load();
  }

  return (
    <div>
      <AdminHeader
        title="Categories"
        description="The occasions your gifts are organised under."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Add a category" bodyClassName="p-5">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim()) createCategory();
            }}
          >
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
            <Button type="submit" disabled={!name.trim()} className="shrink-0">
              Create
            </Button>
          </form>
          <p className="mt-3 text-xs text-faint">
            A URL-friendly slug is generated automatically.
          </p>
        </AdminPanel>

        <AdminPanel title={`Categories (${categories.length})`}>
          {categories.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">
              No categories yet.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div>
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-faint">{c.slug}</p>
                  </div>
                  <ConfirmDialog
                    title="Delete this category?"
                    description={`“${c.name}” will be removed.`}
                    confirmLabel="Delete category"
                    onConfirm={() => deleteCategory(c.id)}
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-claret"
                      >
                        Delete
                      </Button>
                    }
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
