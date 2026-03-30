'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Category = { id: string; name: string; slug: string };

type ProductDetails = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: { name: string; slug: string } | null;
};

type FormState = {
  name: string;
  shortDescription: string;
  description: string;
  price: string;
  stock: string;
  categorySlug: string;
};

function HeaderBar({ mode }: Readonly<{ mode: 'create' | 'edit' }>) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          <span className="mc-text-gradient">Admin · Products</span>
        </h1>
        <p className="mt-1 text-sm text-zinc-600">{mode === 'edit' ? 'Edit product.' : 'Add a new product.'}</p>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/admin/products" className="mc-pill hover:bg-white">
          Back to list
        </Link>
        <Link href="/admin" className="mc-pill hover:bg-white">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: Readonly<{ label: string; error?: string; children: React.ReactNode }>) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-zinc-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-700">{error}</span> : null}
    </label>
  );
}

function FieldsSection({
  form,
  setForm,
  categories,
  fieldErrors,
}: Readonly<{
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  categories: Category[];
  fieldErrors: Record<string, string>;
}>) {
  return (
    <>
      <Field label="Name" error={fieldErrors.name}>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mc-input" />
      </Field>

      <Field label="Short description" error={fieldErrors.shortDescription}>
        <input
          value={form.shortDescription}
          onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
          className="mc-input"
        />
      </Field>

      <Field label="Full description" error={fieldErrors.description}>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={6}
          className="mc-input"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Price (LKR)" error={fieldErrors.price}>
          <input
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            onBlur={() => {
              const parsed = Number(form.price);
              if (!Number.isFinite(parsed) || parsed < 0) {
                setForm((f) => ({ ...f, price: '0.00' }));
                return;
              }
              setForm((f) => ({ ...f, price: parsed.toFixed(2) }));
            }}
            className="mc-input"
          />
        </Field>

        <Field label="Quantity" error={fieldErrors.stock}>
          <input
            type="number"
            min={0}
            step={1}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="mc-input"
          />
        </Field>
      </div>

      <Field label="Category" error={fieldErrors.categorySlug}>
        <select
          value={form.categorySlug}
          onChange={(e) => setForm((f) => ({ ...f, categorySlug: e.target.value }))}
          className="mc-input"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>
    </>
  );
}

function ImagesSection({
  mode,
  existingImagesCount,
  imageFiles,
  imagePreviews,
  imageInputRef,
  onPickFiles,
  onRemove,
}: Readonly<{
  mode: 'create' | 'edit';
  existingImagesCount: number;
  imageFiles: File[];
  imagePreviews: string[];
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  onPickFiles: (files: File[]) => void;
  onRemove: (index: number) => void;
}>) {
  return (
    <div className="grid gap-2">
      <label className="grid gap-1">
        <span className="text-xs font-medium text-zinc-700">Images</span>
        <div className="text-xs text-zinc-600">Select up to 10 images. You can add more by selecting again.</div>
        {mode === 'edit' ? (
          <div className="text-xs text-zinc-600">
            Existing images: {existingImagesCount}. To change images, select new files (this will replace existing images).
          </div>
        ) : null}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length === 0) return;
            onPickFiles(selected);
            if (imageInputRef.current) imageInputRef.current.value = '';
          }}
          className="mc-input"
        />
      </label>

      <div className="text-xs text-zinc-600">{imageFiles.length > 0 ? `Selected ${imageFiles.length} image(s)` : 'No images selected'}</div>

      {imagePreviews.length > 0 ? (
        <div className="grid grid-cols-4 gap-2">
          {imagePreviews.map((src, idx) => (
            <div key={`${src}-${idx}`} className="mc-card relative aspect-square overflow-hidden p-0">
              <Image
                src={src}
                alt={imageFiles[idx]?.name ?? 'Selected image'}
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute right-2 top-2 mc-pill bg-white/80 text-zinc-900 hover:bg-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SubmitRow({
  mode,
  disabled,
  submitting,
  onSubmit,
}: Readonly<{
  mode: 'create' | 'edit';
  disabled: boolean;
  submitting: boolean;
  onSubmit: () => void;
}>) {
  return (
    <div className="flex items-center justify-end gap-3 pt-2">
      <button
        type="button"
        disabled={disabled || submitting}
        onClick={onSubmit}
        className="mc-btn disabled:cursor-not-allowed"
      >
        {mode === 'edit' ? 'Save changes' : 'Create product'}
      </button>
    </div>
  );
}

function mergeImageFiles(existing: File[], added: File[]) {
  const seen = new Set(existing.map((f) => `${f.name}:${f.size}:${f.lastModified}`));
  const merged = [...existing];
  for (const f of added) {
    const key = `${f.name}:${f.size}:${f.lastModified}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(f);
  }
  return merged;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Invalid file result'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function getNextAfterUnauthorized(mode: 'create' | 'edit', productId?: string) {
  if (mode === 'edit' && productId) return `/admin/products/${productId}`;
  return '/admin/products/new';
}

function getDefaultFormState(): FormState {
  return {
    name: '',
    shortDescription: '',
    description: '',
    price: '0.00',
    stock: '0',
    categorySlug: '',
  };
}

function computeCanSubmit(form: FormState) {
  const price = Number(form.price);
  const stock = Number(form.stock);
  return (
    form.name.trim().length > 0 &&
    form.shortDescription.trim().length > 0 &&
    form.description.trim().length > 0 &&
    Number.isFinite(price) &&
    price >= 0 &&
    Number.isInteger(stock) &&
    stock >= 0 &&
    form.categorySlug.trim().length > 0
  );
}

function computeFieldErrors(form: FormState, submitAttempted: boolean) {
  if (!submitAttempted) return {} as Record<string, string>;

  const price = Number(form.price);
  const stock = Number(form.stock);

  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.shortDescription.trim()) errors.shortDescription = 'Short description is required.';
  if (!form.description.trim()) errors.description = 'Full description is required.';
  if (!Number.isFinite(price) || price < 0) errors.price = 'Enter a valid price.';
  if (!Number.isInteger(stock) || stock < 0) errors.stock = 'Quantity must be a whole number.';
  if (!form.categorySlug.trim()) errors.categorySlug = 'Category is required.';

  return errors;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch('/api/categories');
  if (!res.ok) return [];
  const data: unknown = await res.json().catch(() => []);
  return Array.isArray(data) ? (data as Category[]) : [];
}

async function fetchProductDetails(id: string): Promise<ProductDetails | null> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  const data: unknown = await res.json().catch(() => null);
  return data ? (data as ProductDetails) : null;
}

async function createOrUpdateProduct(opts: {
  mode: 'create' | 'edit';
  productId?: string;
  form: FormState;
  imageFiles: File[];
}) {
  const { mode, productId, form, imageFiles } = opts;
  const images = imageFiles.length > 0 ? await Promise.all(imageFiles.map(fileToDataUrl)) : null;

  const endpoint = mode === 'edit' ? `/api/products/${productId}` : '/api/products';
  const method = mode === 'edit' ? 'PATCH' : 'POST';

  const payload: any = {
    name: form.name,
    shortDescription: form.shortDescription,
    description: form.description,
    price: Number(form.price),
    stock: Number(form.stock),
    categorySlug: form.categorySlug,
  };
  if (images) payload.images = images;

  return fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function ProductForm({
  mode,
  productId,
}: Readonly<{
  mode: 'create' | 'edit';
  productId?: string;
}>) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [existingImagesCount, setExistingImagesCount] = useState(0);

  const [form, setForm] = useState<FormState>(getDefaultFormState);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  const canSubmit = useMemo(() => computeCanSubmit(form), [form]);
  const fieldErrors = useMemo(() => computeFieldErrors(form, submitAttempted), [form, submitAttempted]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        if (mode === 'edit') {
          if (!productId) {
            toast.error('Missing product id');
            router.push('/admin/products');
            return;
          }

          const data = await fetchProductDetails(productId);
          if (!data) {
            toast.error('Failed to load product');
            router.push('/admin/products');
            return;
          }

          setExistingImagesCount(Array.isArray(data.images) ? data.images.length : 0);
          setForm({
            name: data.name ?? '',
            shortDescription: data.shortDescription ?? '',
            description: data.description ?? '',
            price: Number(data.price ?? 0).toFixed(2),
            stock: String(data.stock ?? 0),
            categorySlug: data.category?.slug ?? cats?.[0]?.slug ?? '',
          });

          setImageFiles([]);
          if (imageInputRef.current) imageInputRef.current.value = '';
          return;
        }

        setForm((f) => ({
          ...f,
          categorySlug: f.categorySlug || cats?.[0]?.slug || '',
        }));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mode, productId, router]);

  function removeImageAtIndex(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function pickFiles(selected: File[]) {
    setImageFiles((prev) => {
      const merged = mergeImageFiles(prev, selected);
      if (merged.length > 10) {
        toast.error('Please select up to 10 images');
        return merged.slice(0, 10);
      }
      return merged;
    });
  }

  async function submit() {
    setSubmitAttempted(true);

    if (!canSubmit) {
      toast.error('Please fill the required fields');
      return;
    }

    if (imageFiles.length > 10) {
      toast.error('Please select up to 10 images');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createOrUpdateProduct({ mode, productId, form, imageFiles });

      if (res.status === 401) {
        toast.error('Please log in as admin to manage products');
        const nextPath = getNextAfterUnauthorized(mode, productId);
        router.push('/login?next=' + encodeURIComponent(nextPath));
        return;
      }

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.error ?? 'Save failed';
        toast.error(msg);
        return;
      }

      toast.success(mode === 'edit' ? 'Product updated' : 'Product created');
      router.push('/admin/products');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mc-container py-10">
      <HeaderBar mode={mode} />

      <div className="mt-6 mc-card overflow-hidden p-0">
        <div className="border-b border-white/50 p-5">
          <div className="text-sm font-medium">{mode === 'edit' ? 'Edit product' : 'Add product'}</div>
          <div className="mt-1 text-xs text-zinc-600">
            {mode === 'edit' ? 'Update fields and save changes.' : 'Add details, select images, then create.'}
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-sm text-zinc-600">Loading…</div>
          ) : (
            <div className="grid gap-4">
              <FieldsSection form={form} setForm={setForm} categories={categories} fieldErrors={fieldErrors} />

              <ImagesSection
                mode={mode}
                existingImagesCount={existingImagesCount}
                imageFiles={imageFiles}
                imagePreviews={imagePreviews}
                imageInputRef={imageInputRef}
                onPickFiles={pickFiles}
                onRemove={removeImageAtIndex}
              />

              <SubmitRow mode={mode} disabled={!canSubmit} submitting={submitting} onSubmit={submit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
