/**
 * Central site/SEO config. Everything that needs an absolute URL (canonical
 * tags, sitemap, robots, OpenGraph, JSON-LD) derives from here so there is a
 * single source of truth. Override the domain per environment with
 * NEXT_PUBLIC_SITE_URL (e.g. preview deploys); falls back to production.
 */
/**
 * Resolve the canonical site origin used for every absolute URL (OpenGraph
 * images, canonical tags, sitemap, robots, JSON-LD). Returns no trailing slash.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SITE_URL — explicit override; wins everywhere (incl. client).
 *  2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's canonical production domain.
 *     Today that's the live `*.vercel.app` URL and it automatically becomes the
 *     custom domain (e.g. themooncharm.lk) the moment that domain is attached
 *     in Vercel, so og:image always points at a host that actually serves it.
 *  3. https://themooncharm.lk — final fallback for local / non-Vercel builds.
 *
 * Note: VERCEL_PROJECT_PRODUCTION_URL is server-only, which is fine — the URL
 * is only read in server contexts. Client code only reads siteConfig.whatsapp.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`.replace(/\/$/, '');

  return 'https://themooncharm.lk';
}

export const siteConfig = {
  name: 'THE MOON CHARM',
  // No trailing slash. URL() further down normalises anything stray.
  url: resolveSiteUrl(),
  description:
    'A curated gift house in Kuliyapitiya, Sri Lanka. Hand-assembled gift packages and individual pieces for birthdays, anniversaries, weddings, and every moment worth marking. Island-wide delivery.',
  locale: 'en_LK',
  currency: 'LKR',
  twitter: '@themooncharm',
  // WhatsApp number in wa.me format: country code + number, digits only, no "+".
  whatsapp: '94781769568', // original public number (+94 78 176 95 68) — uncomment to revert
  // whatsapp: '94703495386', // temporary: 070 349 5386
  keywords: [
    'gift shop Sri Lanka',
    'gift packages',
    'birthday gifts',
    'anniversary gifts',
    'wedding gifts',
    'curated gifts',
    'handmade gifts',
    'gift delivery Sri Lanka',
    'Kuliyapitiya',
    'THE MOON CHARM',
  ],
} as const;

// Bank transfer details shown to customers at checkout. TODO: replace these
// placeholders with the real account before going live.
export const bankDetails = {
  bankName: 'Bank of Ceylon',
  accountName: 'THE MOON CHARM',
  accountNumber: '0000 0000 0000',
  branch: 'Kuliyapitiya',
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
