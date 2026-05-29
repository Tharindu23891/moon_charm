'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1520975958225-2a44e04e0a4b?auto=format&fit=crop&w=1200&q=60';

export function ProductImageGallery({ images, productName }: Readonly<ProductImageGalleryProps>) {
  const galleryImages = useMemo(() => (images.length ? images : [FALLBACK_IMAGE]), [images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = galleryImages[activeImageIndex];
  const hasMultipleImages = galleryImages.length > 1;

  const showPreviousImage = () => {
    setActiveImageIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % galleryImages.length);
  };

  return (
    <div>
      <div className="mc-card relative aspect-4/3 overflow-hidden p-0">
        <Image src={activeImage} alt={productName} fill sizes="600px" className="object-cover" />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              aria-label="Show previous image"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-white/85 p-2 text-neutral-800 shadow transition hover:bg-white"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Show next image"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/70 bg-white/85 p-2 text-neutral-800 shadow transition hover:bg-white"
            >
              <ChevronRight />
            </button>
            <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/55 px-2 py-0.5 text-xs text-white">
              {activeImageIndex + 1}/{galleryImages.length}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages ? (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {galleryImages.slice(0, 8).map((src, index) => {
            const isActive = index === activeImageIndex;
            return (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`mc-card relative aspect-square overflow-hidden p-0 ${
                  isActive ? 'ring-2 ring-fuchsia-500' : 'ring-0'
                }`}
                aria-label={`Show image ${index + 1}`}
              >
                <Image src={src} alt={`${productName} thumbnail ${index + 1}`} fill sizes="150px" className="object-cover" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M7.5 4.5L13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
