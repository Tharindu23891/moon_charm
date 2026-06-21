import Link from 'next/link';
import { BrandName } from '@/components/brand-name';
import { MoonMark } from '@/components/moon-mark';

const shopLinks = [
  { href: '/products', label: 'All gifts' },
  { href: '/packages', label: 'Gift packages' },
  { href: '/categories', label: 'Shop by occasion' },
];

const companyLinks = [
  { href: '/about', label: 'Our story' },
  { href: '/contact', label: 'Contact' },
  { href: '/orders', label: 'Track an order' },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-espresso text-on-dark">
      <div className="mc-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-7 w-7 text-honey">
                <MoonMark />
              </span>
              <BrandName noWrap className="text-[1.2rem]" />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-dark/70">
              A small gift house in Kuliyapitiya. We assemble each package by hand,
              so the thought arrives intact.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <Social label="Instagram" href="#">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4z" />
                <circle cx="12" cy="12" r="3.5" />
                <path strokeLinecap="round" d="M17.5 6.5h.01" />
              </Social>
              <Social label="Facebook" href="#">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 8h3V5h-3a4 4 0 0 0-4 4v3H7v3h3v6h3v-6h3l1-3h-4V9a1 1 0 0 1 1-1z" />
              </Social>
              <Social label="Pinterest" href="#">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2.9.5 1.7 1.4 1.7 1.7 0 2.9-2.2 2.9-4.7 0-2-1.3-3.4-3.7-3.4a4.2 4.2 0 0 0-4.4 4.2c0 .8.3 1.4.6 1.8l-.3 1c0 .2-.2.3-.4.2-1.1-.5-1.7-2-1.7-3.2 0-2.6 1.9-5 5.6-5 2.9 0 5.2 2.1 5.2 4.9 0 2.9-1.8 5.3-4.4 5.3-.9 0-1.7-.5-2-1l-.5 2c-.2.8-.8 1.8-1.2 2.4A10 10 0 1 0 12 2z" />
              </Social>
            </div>
          </div>

          <FooterColumn title="Shop" links={shopLinks} />
          <FooterColumn title="The house" links={companyLinks} />

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-lg text-on-dark">Letters from the moon</h3>
            <p className="mt-2 text-sm text-on-dark/70">
              Seasonal arrivals and gifting ideas, a few times a year. Never noise.
            </p>
            <form className="mt-4 flex gap-2" aria-label="Newsletter signup">
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-11 w-full rounded-[var(--r)] border border-white/15 bg-white/5 px-3.5 text-sm text-on-dark placeholder:text-on-dark/45 outline-none transition focus:border-honey/60 focus:bg-white/10"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-[var(--r)] bg-honey px-4 text-sm font-semibold text-espresso transition hover:brightness-105"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-on-dark/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The Moon Charm. Made by hand in Sri Lanka.</p>
          <div className="flex items-center gap-5">
            <a href="mailto:info.themooncharm@gmail.com" className="transition-colors hover:text-on-dark">info.themooncharm@gmail.com</a>
            <span aria-hidden className="text-on-dark/25">·</span>
            <a href="tel:+94781769568" className="transition-colors hover:text-on-dark">+94 78 176 95 68</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-dark/50">{title}</h3>
      <ul className="mt-4 grid gap-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-on-dark/80 transition-colors hover:text-on-dark">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-on-dark/75 transition-colors hover:border-honey/50 hover:text-honey"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[1.05rem] w-[1.05rem]">
        {children}
      </svg>
    </a>
  );
}
