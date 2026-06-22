'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/cn';
import { easeOut } from '@/components/motion/transitions';
import { Button } from '@/components/ui/button';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=70';

export function ProductImageGallery({
  images,
  productName,
}: Readonly<ProductImageGalleryProps>) {
  const galleryImages = useMemo(
    () => (images.length ? images : [FALLBACK_IMAGE]),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = galleryImages[activeIndex];
  const hasMultiple = galleryImages.length > 1;

  const prev = () =>
    setActiveIndex(
      (c) => (c - 1 + galleryImages.length) % galleryImages.length,
    );
  const next = () => setActiveIndex((c) => (c + 1) % galleryImages.length);

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[var(--r-xl)] bg-surface">
        {/* Crossfade: the entering frame settles out of a slight zoom while the
            previous one fades beneath it. Exit is opacity-only (subtler than
            the enter), so attention follows the arriving image. */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <Image
              src={activeImage}
              alt={productName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 560px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Previous image"
              onClick={prev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-bg/85 opacity-0 backdrop-blur-sm transition-[opacity,background-color,border-color] group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Chevron dir="left" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Next image"
              onClick={next}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-bg/85 opacity-0 backdrop-blur-sm transition-[opacity,background-color,border-color] group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Chevron dir="right" />
            </Button>
          </>
        ) : null}
      </div>

      {hasMultiple ? (
        <div className="mt-3 grid grid-cols-5 gap-2.5">
          {galleryImages.slice(0, 10).map((src, index) => (
            <Button
              key={`${src}-${index}`}
              type="button"
              variant="ghost"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                'relative aspect-square h-auto overflow-hidden rounded-[var(--r)] bg-surface p-0 transition-[box-shadow,opacity] duration-200 hover:bg-surface',
                index === activeIndex
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg'
                  : 'opacity-70 hover:opacity-100',
              )}
            >
              <Image
                src={src}
                alt={`${productName} ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'}
      />
    </svg>
  );
}
