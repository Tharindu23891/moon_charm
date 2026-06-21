import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
import { Spectral, Hanken_Grotesk } from 'next/font/google';
import { SiteFooter } from '@/components/site-footer';
import { SiteNavbar } from '@/components/site-navbar';
import { Providers } from '@/app/providers';

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
  title: {
    default: 'The Moon Charm — Gifts made to be remembered',
    template: '%s — The Moon Charm',
  },
  description:
    'A curated gift house. Hand-assembled gift packages and individual pieces for birthdays, anniversaries, weddings, and every moment worth marking.',
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
