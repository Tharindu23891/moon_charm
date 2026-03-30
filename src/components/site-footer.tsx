import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-gradient-to-br from-violet-950 via-purple-950 to-fuchsia-950 text-white">
      <div className="mc-container grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="text-base font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-rose-200 bg-clip-text text-transparent">
                The Moon Charm
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Premium gifts and curated packages for every occasion — delivered with love and a little moonlit magic.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <SocialIcon label="Instagram" />
            <SocialIcon label="Twitter" />
            <SocialIcon label="Facebook" />
          </div>
        </div>

        <div className="text-sm">
          <div className="text-sm font-semibold text-white/90">Shop</div>
          <div className="mt-3 grid gap-2 text-white/75">
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <Link href="/packages" className="transition-colors hover:text-white">
              Packages
            </Link>
            <Link href="/categories" className="transition-colors hover:text-white">
              Categories
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About Us
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="text-sm">
          <div className="text-sm font-semibold text-white/90">Newsletter</div>
          <p className="mt-3 text-sm text-white/75">
            Get new arrivals, seasonal bundles, and exclusive offers.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur transition-all focus:border-fuchsia-200/60 focus:ring-2 focus:ring-fuchsia-200/30"
            />
            <button
              type="button"
              className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 px-4 text-sm font-semibold text-white shadow-md shadow-fuchsia-400/20 transition-all hover:brightness-110"
            >
              Join
            </button>
          </div>

          <div className="mt-6 grid gap-1 text-xs text-white/70">
            <div>Email: support@mooncharm.example</div>
            <div>Phone: +1 (000) 000-0000</div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
          © {new Date().getFullYear()} The Moon Charm
      </div>
    </footer>
  );
}

function SocialIcon({ label }: Readonly<{ label: 'Instagram' | 'Twitter' | 'Facebook' }>) {
  const common =
    'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur transition-all hover:bg-white/15 hover:brightness-110';

  if (label === 'Instagram') {
    return (
      <button type="button" aria-label="Instagram" className={common}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/85">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11.37a4 4 0 11-7.74 1.26 4 4 0 017.74-1.26z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5h.01" />
        </svg>
      </button>
    );
  }

  if (label === 'Twitter') {
    return (
      <button type="button" aria-label="Twitter" className={common}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/85">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 4.01c-.8.36-1.65.6-2.55.71a4.47 4.47 0 001.96-2.47 8.94 8.94 0 01-2.83 1.08A4.46 4.46 0 0011.1 7.41a12.66 12.66 0 01-9.2-4.66 4.46 4.46 0 001.38 5.95A4.42 4.42 0 01.8 8.1v.06a4.46 4.46 0 003.58 4.37 4.5 4.5 0 01-2.01.08 4.46 4.46 0 004.17 3.1A8.94 8.94 0 012 18.3a12.62 12.62 0 006.86 2.01c8.24 0 12.75-6.82 12.75-12.73 0-.19 0-.38-.01-.57A9.1 9.1 0 0022 4.01z" />
        </svg>
      </button>
    );
  }

  return (
    <button type="button" aria-label="Facebook" className={common}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-white/85">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h3V5h-3a4 4 0 00-4 4v3H7v3h3v6h3v-6h3l1-3h-4V9a1 1 0 011-1z" />
      </svg>
    </button>
  );
}
