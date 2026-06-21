'use client';

import { useEffect, useRef, useState, type ElementType } from 'react';
import { cn } from '@/lib/cn';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
};

/**
 * Reveals its children with a gentle fade-and-rise as they scroll into view.
 *
 * The motion is purely additive: content is visible by default (see `.mc-reveal`
 * in globals.css, which only hides under `.js-reveal` set by the inline script in
 * the root layout, and never under reduced-motion). If JS never runs, the observer
 * never fires, or the user prefers reduced motion, the content simply shows.
 */
export function Reveal({ children, className, delay = 0, as }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    // Safety net: if the observer never fires (background tab, odd renderer),
    // reveal anyway so nothing ships blank.
    const fallback = window.setTimeout(() => setShown(true), 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={cn('mc-reveal', shown && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
