'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const IMAGES = [
  '/about/hero.jpeg',
  '/about/1.jpeg',
  '/about/2.jpeg',
  '/about/3.jpeg',
];

export function HeroCarousel({ className = '' }: Readonly<{ className?: string }>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col items-center gap-5 w-full ${className}`}>
      {/* Aspect-ratio image container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[var(--r-xl)] bg-espresso shadow-[var(--shadow-lg)]">
        {IMAGES.map((src, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={src}
                alt={`THE MOON CHARM gallery image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          );
        })}
      </div>

      {/* Navigation Indicators below the image */}
      <div className="flex justify-center gap-2.5">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-ink scale-110'
                : 'bg-line hover:bg-faint'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
