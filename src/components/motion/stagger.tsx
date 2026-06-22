'use client';

import { type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { motionTags, type MotionTag } from '@/components/motion/tags';
import { enterHidden, enterShown, revealSpring } from '@/components/motion/transitions';

type StaggerProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
  /** Gap between each child's entrance, in seconds. */
  stagger?: number;
  /** Delay before the first child enters, in seconds. */
  delayChildren?: number;
};

/**
 * Orchestrates a one-shot entrance for its direct {@link StaggerItem} children,
 * each fading-rising-into-focus a beat after the last. Use for content that is
 * present on load (a hero), where a hand-led sequence reads more composed than
 * everything arriving at once.
 *
 * Reduced-motion users get everything in place, instantly.
 */
export function Stagger({
  children,
  className,
  as = 'div',
  stagger = 0.09,
  delayChildren = 0.06,
}: StaggerProps) {
  const reduce = useReducedMotion();
  const MotionTag = motionTags[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren } },
      }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: MotionTag;
};

/** A single member of a {@link Stagger} sequence. */
export function StaggerItem({ children, className, as = 'div' }: StaggerItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = motionTags[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{ hidden: enterHidden, show: { ...enterShown, transition: revealSpring } }}
    >
      {children}
    </MotionTag>
  );
}
