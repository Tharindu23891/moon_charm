import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Spectral, Hanken_Grotesk } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteNavbar } from '@/components/site-navbar';
import { Providers } from '@/app/providers';
import { JsonLd } from '@/components/json-ld';
import { siteConfig, absoluteUrl } from '@/lib/site';

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-spectral',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hanken',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'The Moon Charm — Gifts made to be remembered',
    template: '%s — The Moon Charm',
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'shopping',
  // og:image and twitter:image are supplied by the src/app/opengraph-image.png
  // file convention, which Next resolves against the serving origin (the live
  // domain in production; localhost only while developing).
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: 'The Moon Charm — Gifts made to be remembered',
    description: siteConfig.description,
    url: siteConfig.url,
    locale: siteConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Moon Charm — Gifts made to be remembered',
    description: siteConfig.description,
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

// Organization + storefront identity for the knowledge panel and rich results.
// Lives on every page so any entry point establishes the brand entity.
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  '@id': absoluteUrl('/#organization'),
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: absoluteUrl('/opengraph-image.png'),
  logo: absoluteUrl('/apple-icon.png'),
  email: 'info.themooncharm@gmail.com',
  telephone: '+94781769568',
  priceRange: 'LKR',
  currenciesAccepted: siteConfig.currency,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kuliyapitiya',
    addressCountry: 'LK',
  },
  areaServed: { '@type': 'Country', name: 'Sri Lanka' },
  sameAs: [] as string[],
};

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': absoluteUrl('/#website'),
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { '@id': absoluteUrl('/#organization') },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: absoluteUrl('/products?q={search_term_string}'),
    },
    'query-input': 'required name=search_term_string',
  },
};

// Flag reveal animations only when JS runs and motion is welcome. Runs before
// paint so revealed content never flashes; without it, content stays visible.
const revealFlag = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-reveal')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${spectral.variable} ${hanken.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: revealFlag }} />
        <JsonLd data={organizationLd} />
        <JsonLd data={websiteLd} />
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <SiteNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'var(--color-bg)',
                color: 'var(--color-ink)',
                border: '1px solid var(--color-line)',
                borderRadius: 'var(--r)',
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
