/**
 * Central site/SEO config. Everything that needs an absolute URL (canonical
 * tags, sitemap, robots, OpenGraph, JSON-LD) derives from here so there is a
 * single source of truth. Override the domain per environment with
 * NEXT_PUBLIC_SITE_URL (e.g. preview deploys); falls back to production.
 */
export const siteConfig = {
  name: 'The Moon Charm',
  // No trailing slash. URL() further down normalises anything stray.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://themooncharm.lk').replace(
    /\/$/,
    '',
  ),
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
    'The Moon Charm',
  ],
} as const;

// Bank transfer details shown to customers at checkout. TODO: replace these
// placeholders with the real account before going live.
export const bankDetails = {
  bankName: 'Bank of Ceylon',
  accountName: 'The Moon Charm',
  accountNumber: '0000 0000 0000',
  branch: 'Kuliyapitiya',
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
