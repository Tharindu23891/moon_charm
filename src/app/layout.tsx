import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Inter, Instrument_Sans } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteNavbar } from '@/components/site-navbar';
import { Providers } from '@/app/providers';

const inter = Inter({
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'The Moon Charm — Gifts & Packages',
    template: '%s — The Moon Charm',
  },
  description: 'Shop gifts, bundles, and curated packages for every occasion.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <SiteNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster richColors position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
