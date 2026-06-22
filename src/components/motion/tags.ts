import { motion } from 'motion/react';

/**
 * The intrinsic elements our motion primitives are allowed to render as.
 * Keeping this map small (and typed) lets `Reveal`/`Stagger` accept an `as`
 * prop while still resolving to a real `motion.*` component, not a string.
 */
export const motionTags = {
  div: motion.div,
  section: motion.section,
  p: motion.p,
  span: motion.span,
  ul: motion.ul,
  li: motion.li,
  figure: motion.figure,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
} as const;

export type MotionTag = keyof typeof motionTags;
