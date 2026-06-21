# Design

The visual system for The Moon Charm. Warm, romantic, editorial luxury. A clean,
bright canvas; warmth carried by a honeyed-sienna primary, a romantic claret
accent, real gift photography, and a serif/sans type pairing. No gradients, no
glass, no SaaS chrome.

Mood, in one phrase: *late-summer honey hour, a wax-sealed letter and pressed
petals on a sunlit table, warm light on bright linen.*

## Theme

Light, always. The scene is daylight in a small, beautiful gift parlor, so the
canvas is bright and the warmth comes from the brand colors and imagery, not from
a tinted background. Pure-white page with occasional soft warm panels.

## Color (OKLCH)

Strategy: **Committed** with a romantic second voice. The honeyed-sienna primary
carries identity across CTAs and marks; the claret accent appears sparingly for
romance and emphasis; rich photography supplies the rest of the warmth.

| Token | OKLCH | Role |
|---|---|---|
| `--color-bg` | `oklch(1 0 0)` | Page canvas, pure white |
| `--color-surface` | `oklch(0.975 0.008 75)` | Cards, panels, subtle warm off-white |
| `--color-sand` | `oklch(0.955 0.013 70)` | Occasional full-bleed warm sections (used sparingly) |
| `--color-ink` | `oklch(0.22 0.012 60)` | Body + headings, warm near-black espresso |
| `--color-muted` | `oklch(0.44 0.016 55)` | Secondary text (>=4.5:1 on bg/surface) |
| `--color-line` | `oklch(0.90 0.008 70)` | Hairline borders |
| `--color-line-strong` | `oklch(0.84 0.01 65)` | Stronger dividers |
| `--color-primary` | `oklch(0.50 0.115 54)` | Deep honeyed sienna. CTAs, primary buttons, brand marks. White text. |
| `--color-primary-hover` | `oklch(0.44 0.115 52)` | Primary hover/active |
| `--color-honey` | `oklch(0.80 0.14 72)` | Bright honey for decoration only (rules, icon fills, glow). Never bears small text. |
| `--color-accent` | `oklch(0.40 0.125 16)` | Romantic claret. Sparing emphasis, wishlist, special tags. White text. |
| `--color-blush` | `oklch(0.945 0.022 24)` | Pale romantic tint for pills/panels. Dark text. |
| `--color-success` | `oklch(0.50 0.09 140)` | In stock, delivered |
| `--color-danger` | `oklch(0.52 0.17 25)` | Out of stock, destructive, errors |

**Text-on-fill rule:** white text on `--color-primary`, `--color-accent`,
`--color-danger`, `--color-success` (saturated mid fills). Dark `--color-ink`
text on `--color-blush` and white/surface fills only. Verify >=4.5:1 for any
text below 18.66px bold.

Retired for good: violet/fuchsia/rose gradients, `background-clip:text` gradient
text, frosted-glass cards.

## Typography

Two families, paired on a contrast axis (serif + grotesque). Both via `next/font`.

- **Display / serif: Spectral** (`--font-display`). Headings, hero, prices,
  pull-quotes, romantic italic accents. Weights 300/400/500/600 + italics. Used
  large and airy, never cramped.
- **Body / UI: Hanken Grotesk** (`--font-sans`). Body copy, labels, buttons, nav,
  forms, tables. Weights 400/500/600/700.

Neither was in the prior identity; both deliberately avoid the Playfair / Cormorant
/ Fraunces / Inter defaults.

Fluid scale, ratio ~1.25, `clamp()` on headings (display ceiling <= 5.5rem):

| Step | Size |
|---|---|
| display | `clamp(2.75rem, 6vw, 5.25rem)` Spectral 400 |
| h1 | `clamp(2.1rem, 4vw, 3.4rem)` Spectral 400 |
| h2 | `clamp(1.65rem, 3vw, 2.4rem)` Spectral 500 |
| h3 | `clamp(1.25rem, 2vw, 1.55rem)` Spectral 500 |
| body-lg | `1.125rem` Hanken 400 |
| body | `1rem` Hanken 400 |
| small | `0.875rem` Hanken 500 |
| label | `0.75rem` Hanken 600, uppercase, tracking `0.08em`, used sparingly |

Rules: display tracking `-0.02em` (never tighter than -0.04em); `text-wrap:balance`
on h1-h3, `text-wrap:pretty` on prose; prose column capped at ~68ch; no all-caps
body; labels only on short strings and never as an eyebrow above every section.

## Spacing & Layout

- Containers: `--container: 76rem` default; `--container-wide: 90rem` for
  image-led sections; prose capped ~68ch.
- Section rhythm via `clamp()`: vertical section padding
  `clamp(3.5rem, 8vw, 7rem)`. Vary it; do not apply one uniform gap everywhere.
- Grids: `repeat(auto-fit, minmax(260px, 1fr))` for breakpoint-free card rows;
  flex-wrap for 1D. Asymmetry and editorial offsets are welcome.
- Full-bleed hero imagery is a canonical move; let the photograph be the design.

## Radii & Elevation

- Radii: `--r-sm 8px`, `--r 12px`, `--r-lg 18px`, `--r-xl 24px`, full for
  avatars/pills. Refined, not pill-shaped buttons.
- Shadows: soft and warm, low spread. `--shadow-sm: 0 1px 2px rgb(54 38 22/.05)`,
  `--shadow: 0 6px 24px rgb(54 38 22/.07)`, `--shadow-lg: 0 18px 48px rgb(54 38 22/.10)`.
  No colored glow, no heavy drop shadows.
- Borders: 1px `--color-line`. No colored side-stripe accents (banned).

## Components

- **Button**: primary (solid `--primary`, white text), secondary (1px outline,
  ink text, hover warm tint), ghost (text only), link (underline on hover). Radius
  `--r`. Subtle press scale, no bounce.
- **Tag / pill**: `--r` full; blush or surface fill, ink text; claret variant for
  romantic emphasis.
- **Input / textarea / select**: surface fill, 1px line border, ink text,
  placeholder at >=4.5:1, primary focus ring. Generous height (44px touch target).
- **Product / package card**: image-forward, no glass. Generous image, name in
  Spectral, price prominent (solid color, never gradient), calm category tag,
  honest stock line, add-to-cart. Single border or none; not nested cards.
- **Navbar**: clean sticky bar, off-white at scroll, wordmark + serif, restrained
  nav, cart + account. No backdrop-blur glass styling.
- **Footer**: deep warm ink-brown ground (not violet), brand note, columns,
  newsletter, real-feeling contact info.
- **Section header**: serif h2 + short muted sub. One optional named kicker, not
  an eyebrow on every section.
- **Reveal**: IntersectionObserver wrapper; content is visible by default and the
  reveal only enhances (never gates visibility); full reduced-motion fallback.

## Motion

Intentional and quiet. Ease-out (expo/quint), 200-600ms, no bounce/elastic.
Per-element entrances that fit what they reveal (a hero choreography, a staggered
product row), never one uniform fade on every section. Hover: subtle image zoom,
gentle lift, link underlines. Every animation has a
`@media (prefers-reduced-motion: reduce)` crossfade/instant fallback. CSS +
IntersectionObserver; no motion library needed for this build.

## Imagery

Image-led brief: real gift photography is required, not colored placeholders.
Source from Unsplash via the existing custom loader (`next/image` + `sizes`).
Search for the physical object and the moment ("ribbon-tied gift box on linen with
dried flowers", "hands wrapping a present in brown paper") over generic "gift".
One decisive hero photo beats five mediocre ones. Alt text is part of the voice.

## Accessibility

WCAG 2.1 AA. Verified contrast on all text/fill pairings, visible focus rings,
keyboard operability, semantic landmarks, labelled controls, reduced-motion
fallbacks. See PRODUCT.md for the full statement.
