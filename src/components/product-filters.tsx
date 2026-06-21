'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Category = { id: string; name: string; slug: string };

const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'popularity', label: 'Most loved' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'newest';

  const hasFilters = Boolean(q || category || minPrice || maxPrice || (sort && sort !== 'newest'));

  function go(next: { category?: string; sort?: string }) {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    const cat = next.category ?? category;
    if (cat && cat !== 'all') params.set('category', cat);
    if (minPrice.trim()) params.set('minPrice', minPrice.trim());
    if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
    const s = next.sort ?? sort;
    if (s && s !== 'newest') params.set('sort', s);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function reset() {
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  }

  return (
    <div className="rounded-[var(--r-lg)] border border-line bg-surface p-4 md:p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go({});
        }}
        className="grid gap-3 md:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_1fr]"
      >
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gifts…" aria-label="Search gifts" />

        <Select value={category || 'all'} onValueChange={(v) => go({ category: v })}>
          <SelectTrigger aria-label="Occasion" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All occasions</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" inputMode="decimal" aria-label="Minimum price" />
        <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" inputMode="decimal" aria-label="Maximum price" />

        <Select value={sort} onValueChange={(v) => go({ sort: v })}>
          <SelectTrigger aria-label="Sort by" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center justify-end gap-2 md:col-span-5">
          {hasFilters ? (
            <Button type="button" variant="ghost" onClick={reset}>Reset</Button>
          ) : null}
          <Button type="submit">Apply filters</Button>
        </div>
      </form>
    </div>
  );
}
