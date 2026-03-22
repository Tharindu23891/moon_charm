import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { SiteFooter } from '@/components/site-footer';
import { SiteNavbar } from '@/components/site-navbar';
import { Providers } from '@/app/providers';

export const metadata: Metadata = {
  title: {
    default: 'Moon Charm — Gifts & Packages',
    template: '%s — Moon Charm',
  },
  description: 'Shop gifts, bundles, and curated packages for every occasion.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-dvh flex flex-col">
            <SiteNavbar />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
