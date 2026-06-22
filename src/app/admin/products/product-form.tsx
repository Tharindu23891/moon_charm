'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AdminHeader,
  AdminPanel,
  AdminField,
} from '@/components/admin/admin-ui';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      <AdminField label="Name" error={fieldErrors.name}>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>

      <AdminField
        label="Short description"
        error={fieldErrors.shortDescription}
      >
        <Input
          value={form.shortDescription}
          onChange={(e) =>
            setForm((f) => ({ ...f, shortDescription: e.target.value }))
          }
        />
      </AdminField>

      <AdminField label="Full description" error={fieldErrors.description}>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          rows={6}
        />
      </AdminField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField label="Price (LKR)" error={fieldErrors.price}>
          <Input
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
          />
        </AdminField>

        <AdminField label="Quantity in stock" error={fieldErrors.stock}>
          <Input
            type="number"
            min={0}
            step={1}
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
          />
        </AdminField>
      </div>

      <AdminField label="Category" error={fieldErrors.categorySlug}>
        <Select
          value={form.categorySlug || undefined}
          onValueChange={(v) => setForm((f) => ({ ...f, categorySlug: v }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminField>
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
    <div>
      <span className="mc-label">Images</span>
      <p className="-mt-1 mb-2 text-xs text-faint">
        Up to 10 images.{' '}
        {mode === 'edit'
          ? `Currently ${existingImagesCount}. Selecting new files replaces the existing set.`
          : 'Add the first image to use as the main photo.'}
      </p>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-[var(--r)] border border-dashed border-line-strong bg-surface px-4 py-7 text-center transition-colors hover:border-primary">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-7 w-7 text-muted-foreground"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          />
        </svg>
        <span className="mt-2 text-sm font-medium text-ink">Choose images</span>
        <span className="text-xs text-faint">
          {imageFiles.length > 0
            ? `${imageFiles.length} selected`
            : 'PNG or JPG'}
        </span>
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
          className="sr-only"
        />
      </label>

      {imagePreviews.length > 0 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {imagePreviews.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-[var(--r)] border border-line bg-surface"
            >
              <Image
                src={src}
                alt={imageFiles[idx]?.name ?? 'Selected image'}
                fill
                sizes="120px"
                className="object-cover"
                unoptimized
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => onRemove(idx)}
                aria-label="Remove image"
                className="absolute top-1.5 right-1.5 rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-ink hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function mergeImageFiles(existing: File[], added: File[]) {
  const seen = new Set(
    existing.map((f) => `${f.name}:${f.size}:${f.lastModified}`),
  );
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
  if (!form.shortDescription.trim())
    errors.shortDescription = 'Short description is required.';
  if (!form.description.trim())
    errors.description = 'Full description is required.';
  if (!Number.isFinite(price) || price < 0)
    errors.price = 'Enter a valid price.';
  if (!Number.isInteger(stock) || stock < 0)
    errors.stock = 'Quantity must be a whole number.';
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
  const images =
    imageFiles.length > 0
      ? await Promise.all(imageFiles.map(fileToDataUrl))
      : null;
  const endpoint =
    mode === 'edit' ? `/api/products/${productId}` : '/api/products';
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
}: Readonly<{ mode: 'create' | 'edit'; productId?: string }>) {
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
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

  const canSubmit = useMemo(() => computeCanSubmit(form), [form]);
  const fieldErrors = useMemo(
    () => computeFieldErrors(form, submitAttempted),
    [form, submitAttempted],
  );

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
          setExistingImagesCount(
            Array.isArray(data.images) ? data.images.length : 0,
          );
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
      const res = await createOrUpdateProduct({
        mode,
        productId,
        form,
        imageFiles,
      });
      if (res.status === 401) {
        toast.error('Please sign in as an admin to manage products');
        router.push(
          '/login?next=' +
            encodeURIComponent(getNextAfterUnauthorized(mode, productId)),
        );
        return;
      }
      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.error ?? 'Save failed';
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
    <div>
      <AdminHeader
        title={mode === 'edit' ? 'Edit product' : 'New product'}
        description={
          mode === 'edit'
            ? 'Update the details and save your changes.'
            : 'Add the details and a few photos, then create.'
        }
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </Button>
        }
      />

      <div className="mt-8 max-w-2xl">
        <AdminPanel bodyClassName="p-5 sm:p-6">
          {loading ? (
            <p className="py-6 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-5">
              <FieldsSection
                form={form}
                setForm={setForm}
                categories={categories}
                fieldErrors={fieldErrors}
              />
              <ImagesSection
                mode={mode}
                existingImagesCount={existingImagesCount}
                imageFiles={imageFiles}
                imagePreviews={imagePreviews}
                imageInputRef={imageInputRef}
                onPickFiles={pickFiles}
                onRemove={removeImageAtIndex}
              />
              <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
                <Button asChild variant="ghost">
                  <Link href="/admin/products">Cancel</Link>
                </Button>
                <Button
                  type="button"
                  disabled={!canSubmit || submitting}
                  onClick={submit}
                >
                  {submitting
                    ? 'Saving…'
                    : mode === 'edit'
                      ? 'Save changes'
                      : 'Create product'}
                </Button>
              </div>
            </div>
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
