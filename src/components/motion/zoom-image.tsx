'use client';

import Image, { type ImageProps } from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';
import { imageSettle } from '@/components/motion/transitions';

type ZoomImageProps = ImageProps & {
  /** `load` settles on mount; `view` settles as it scrolls into frame. */
  trigger?: 'load' | 'view';
  /** Classes for the clipping wrapper that holds the scaling image. */
  wrapperClassName?: string;
  /** Starting scale; eases back to 1. */
  zoom?: number;
};

/**
 * An image that settles out of a slow zoom, so photography arrives with a
 * little life rather than snapping in. The wrapper carries the transform and
 * should clip (overflow-hidden); the image fills it.
 *
 * Zoom is a vestibular trigger, so reduced-motion users get a still image with
 * no wrapper transform at all.
 */
export function ZoomImage({
  trigger = 'view',
  wrapperClassName,
  zoom = 1.08,
  className,
  alt,
  ...image
}: ZoomImageProps) {
  const reduce = useReducedMotion();
  const wrapper = cn('absolute inset-0', wrapperClassName);

  if (reduce) {
    return (
      <div className={wrapper}>
        <Image className={className} alt={alt} {...image} />
      </div>
    );
  }

  const motion_ =
    trigger === 'load'
      ? { initial: { scale: zoom }, animate: { scale: 1 } }
      : {
          initial: { scale: zoom },
          whileInView: { scale: 1 },
          viewport: { once: true, amount: 0.2 } as const,
        };

  return (
    <motion.div className={wrapper} transition={imageSettle} {...motion_}>
      <Image className={className} alt={alt} {...image} />
    </motion.div>
  );
}
