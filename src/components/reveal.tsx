'use client';

import { type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { motionTags, type MotionTag } from '@/components/motion/tags';
import { enterHidden, enterShown, revealSpring } from '@/components/motion/transitions';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in milliseconds. */
  delay?: number;
  /** Element to render. Defaults to a div. */
  as?: MotionTag;
};

/**
 * Reveals its children with a gentle fade-rise as they scroll into
 * view: opacity + translateY, so content materialises gracefully. Plays once.
 *
 * Reduced-motion users get the final state immediately with no animation (the
 * content renders in place), so nothing is ever hidden behind motion they have
 * asked not to see.
 */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motionTags[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={enterHidden}
      whileInView={enterShown}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -8% 0px' }}
      transition={{ ...revealSpring, delay: delay / 1000 }}
    >
      {children}
    </MotionTag>
  );
}
