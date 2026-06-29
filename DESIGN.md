# Design

The visual system for THE MOON CHARM. Deep-indigo, romantic, editorial luxury. A
clean, bright white canvas; the identity is carried by a deep-indigo ground (the
logo's `#190D61`), a vivid-blue primary, a royal-indigo accent, real gift
photography, and a serif/sans type pairing. No gradients, no glass, no SaaS chrome.

Mood, in one phrase: _indigo evening and starlight, a sapphire ribbon on white
paper, ink-blue calm under a clear night sky._

## Theme

Light, always. The canvas is bright white; the colour and weight of the brand come
from the blues, the deep-indigo dark sections, and the imagery, not from a tinted
page background. Pure-white page with occasional cool blue-grey panels and
full-bleed deep-indigo sections.

## Color (OKLCH)

Strategy: **Committed** with a cool second voice. The vivid-blue primary carries
identity across CTAs and marks; the royal-indigo (claret) accent appears sparingly
for emphasis; the deep-indigo grounds anchor the dark sections and footer; rich
photography supplies the rest. All values pulled from `src/app/globals.css`.

| Token                   | OKLCH                         | Role                                                                                  |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------- |
| `--color-bg`            | `oklch(1 0 0)`                | Page canvas, pure white                                                               |
| `--color-surface`       | `oklch(0.977 0.006 280)`      | Cards, panels; cool near-white with a faint blue tint                                 |
| `--color-surface-warm`  | `oklch(0.957 0.012 278)`      | Occasional full-bleed soft sections; a cool blue-grey (the old "sand")                |
| `--color-ink`           | `oklch(0.23 0.04 280)`        | Body + headings, deep blue-black                                                      |
| `--color-faint`         | `oklch(0.52 0.035 280)`       | Secondary text (>=4.5:1 on bg/surface)                                                |
| `--color-line`          | `oklch(0.905 0.013 280)`      | Hairline borders                                                                      |
| `--color-line-strong`   | `oklch(0.84 0.02 280)`        | Stronger dividers                                                                     |
| `--color-espresso`      | `oklch(0.225 0.1 278)`        | Deep-indigo dark ground for footer + dark sections (the logo's `#190D61` ground)      |
| `--color-on-dark`       | `oklch(0.96 0.012 285)`       | Text + icons on the indigo ground                                                     |
| `--color-primary`       | `oklch(0.546 0.245 262.881)`  | Vivid blue (`#155dfc`). CTAs, primary buttons, links, focus ring. White text.         |
| `--color-primary-hover` | `oklch(0.48 0.235 263)`       | Primary hover/active                                                                  |
| `--color-honey`         | `oklch(0.72 0.15 256)`        | Light sky-blue for decoration only (rules, icon fills, glow). Never bears small text. |
| `--color-claret`        | `oklch(0.46 0.19 277)`        | Royal-indigo accent. Sparing emphasis, wishlist, special tags. White text.            |
| `--color-claret-hover`  | `oklch(0.4 0.18 277)`         | Claret hover/active                                                                   |
| `--color-blush`         | `oklch(0.93 0.03 274)`        | Pale blue-mist tint for pills/panels. Dark text.                                      |
| `--color-success`       | `oklch(0.52 0.1 150)`         | In stock, delivered                                                                   |
| `--color-danger`        | `oklch(0.52 0.17 25)`         | Out of stock, destructive, errors                                                     |

**Text-on-fill rule:** white text on `--color-primary`, `--color-claret`,
`--color-danger`, `--color-success` (saturated mid fills). Dark `--color-ink` text
on `--color-blush` and white/surface fills only. On the `--color-espresso` indigo
ground, use `--color-on-dark`. Verify >=4.5:1 for any text below 18.66px bold.

Retired for good: the warm honeyed-sienna + claret palette and its champagne-gold
accent; violet/fuchsia/rose gradients; `background-clip:text` gradient text;
frosted-glass cards.

## Brand mark

The mark is the butterfly + calligraphic "T" monogram, vectorised from the master
logo (`public/logo.jpeg`) and shipped as a single `currentColor` path in
[`MoonMark`](src/components/moon-mark.tsx). It replaces the earlier crescent "Charm
Ring." Render it in `--color-primary` on light surfaces and `--color-on-dark` /
white on the deep-indigo grounds. On first load the navbar plays a one-shot draw-on
(`.mc-mark-draw`) as the brand signature moment, with a full reduced-motion
fallback.

Logo assets live in `/public`: `logo.svg`, `logo-wordmark.svg`,
`logo-wordmark-white.svg`, `logo-mark.svg`, `logo-mark-white.svg`, and the source
`logo.jpeg`. Use the white wordmark/mark variants on the indigo grounds, the
standard ones on white.

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

| Step    | Size                                                               |
| ------- | ------------------------------------------------------------------ |
| display | `clamp(2.75rem, 6vw, 5.25rem)` Spectral 400                        |
| h1      | `clamp(2.1rem, 4vw, 3.4rem)` Spectral 400                          |
| h2      | `clamp(1.65rem, 3vw, 2.4rem)` Spectral 500                         |
| h3      | `clamp(1.25rem, 2vw, 1.55rem)` Spectral 500                        |
| body-lg | `1.125rem` Hanken 400                                              |
| body    | `1rem` Hanken 400                                                  |
| small   | `0.875rem` Hanken 500                                              |
| label   | `0.75rem` Hanken 600, uppercase, tracking `0.08em`, used sparingly |

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
- Shadows: soft and cool, low spread. `--shadow-sm: 0 1px 2px rgb(20 16 70/.06)`,
  `--shadow: 0 6px 24px rgb(20 16 70/.08)`, `--shadow-lg: 0 18px 48px rgb(20 16 70/.12)`.
  No colored glow, no heavy drop shadows.
- Borders: 1px `--color-line`. No colored side-stripe accents (banned).

## Components

- **Button**: primary (solid `--primary`, white text), secondary (1px outline,
  ink text, hover soft tint), ghost (text only), link (underline on hover). Radius
  `--r`. Subtle press scale, no bounce.
- **Tag / pill**: `--r` full; blush or surface fill, ink text; claret variant for
  emphasis.
- **Input / textarea / select**: surface fill, 1px line border, ink text,
  placeholder at >=4.5:1, primary focus ring. Generous height (44px touch target).
- **Product / package card**: image-forward, no glass. Generous image, name in
  Spectral, price prominent (solid color, never gradient), calm category tag,
  honest stock line, add-to-cart. Single border or none; not nested cards.
- **Navbar**: clean sticky bar, off-white at scroll, wordmark + serif, restrained
  nav, cart + account. No backdrop-blur glass styling.
- **Footer**: deep-indigo ground (`--color-espresso`, not violet or warm brown),
  brand note, columns, newsletter, real-feeling contact info.
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
