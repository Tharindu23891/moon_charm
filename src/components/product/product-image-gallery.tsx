'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=70';

export function ProductImageGallery({ images, productName }: Readonly<ProductImageGalleryProps>) {
  const galleryImages = useMemo(() => (images.length ? images : [FALLBACK_IMAGE]), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex];
  const hasMultiple = galleryImages.length > 1;

  const prev = () => setActiveIndex((c) => (c - 1 + galleryImages.length) % galleryImages.length);
  const next = () => setActiveIndex((c) => (c + 1) % galleryImages.length);

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[var(--r-xl)] bg-surface">
        <Image src={activeImage} alt={productName} fill priority sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />

        {hasMultiple ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/85 text-ink opacity-0 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-all hover:bg-bg focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={next}
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-bg/85 text-ink opacity-0 shadow-[var(--shadow-sm)] backdrop-blur-sm transition-all hover:bg-bg focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Chevron dir="right" />
            </button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {galleryImages.slice(0, 10).map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'relative aspect-square overflow-hidden rounded-[var(--r)] bg-surface transition',
                index === activeIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg' : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image src={src} alt={`${productName} ${index + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={dir === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}
