/**
 * Shared Motion tokens for THE MOON CHARM.
 *
 * One source of truth for easing and spring feel so every animation across the
 * site reads as the same hand. The brand is warm, editorial, unhurried, so the
 * defaults are smooth springs with no overshoot (Jakub's production default);
 * a touch of bounce is reserved for small delight moments (the cart badge).
 *
 * The ease curve mirrors `--ease-out` in globals.css so anything still driven by
 * CSS (hover lifts, Radix dialogs) and anything driven by Motion move alike.
 */

/** cubic-bezier(0.16, 1, 0.3, 1) — the site's expressive ease-out. */
export const easeOut = [0.16, 1, 0.3, 1] as const;

/** Scroll/entrance reveals: smooth, no overshoot. */
export const revealSpring = {
  type: 'spring',
  duration: 0.55,
  bounce: 0,
} as const;

/** Small, frequent pops where a hint of life is welcome (cart badge). */
export const popSpring = {
  type: 'spring',
  duration: 0.34,
  bounce: 0.3,
} as const;

/** Slow image settle (zoom-out). Tween, not spring, so it eases to rest. */
export const imageSettle = {
  duration: 1.4,
  ease: easeOut,
} as const;

/** The fade/rise/blur an element enters with. Shared by Reveal + Stagger. */
export const enterHidden = { opacity: 0, y: 16, filter: 'blur(6px)' } as const;
export const enterShown = { opacity: 1, y: 0, filter: 'blur(0px)' } as const;
