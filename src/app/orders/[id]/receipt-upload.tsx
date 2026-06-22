'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const MAX_BYTES = 3 * 1024 * 1024; // keep under Vercel's 4.5MB request limit
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === 'string'
        ? resolve(reader.result)
        : reject(new Error('Could not read file'));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

// Downscale large photos so phone snaps stay well under the size cap. PDFs are
// passed through untouched.
async function prepare(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  if (file.type === 'application/pdf') return dataUrl;

  const img = await loadImage(dataUrl);
  const max = 1600;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  if (scale === 1 && file.size <= MAX_BYTES) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export function ReceiptUpload({
  orderId,
  hasReceipt,
}: {
  orderId: string;
  hasReceipt: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      toast.error('Please choose a PDF, JPG, PNG, or WebP file');
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await prepare(file);
      const approxBytes = Math.floor(
        ((dataUrl.split(',')[1]?.length ?? 0) * 3) / 4,
      );
      if (approxBytes > MAX_BYTES) {
        toast.error('That file is too large. Please keep it under 3MB.');
        return;
      }

      const res = await fetch(`/api/orders/${orderId}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipt: dataUrl, filename: file.name }),
      });
      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.error ?? 'Upload failed';
        toast.error(msg);
        return;
      }
      toast.success('Receipt uploaded. We’ll confirm your payment shortly.');
      router.refresh();
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onChange}
      />
      <Button
        type="button"
        size="lg"
        variant={hasReceipt ? 'outline' : 'default'}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy
          ? 'Uploading…'
          : hasReceipt
            ? 'Replace receipt'
            : 'Upload receipt'}
      </Button>
      <p className="mt-2 text-xs text-faint">PDF or image, up to 3MB.</p>
    </div>
  );
}
