'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useCart } from '@/components/cart/cart-context';
import { BrandName } from '@/components/brand-name';
import { MoonMark } from '@/components/moon-mark';
import { cn } from '@/lib/cn';

const links = [
  { href: '/products', label: 'Shop' },
  { href: '/packages', label: 'Gift Packages' },
  { href: '/categories', label: 'Occasions' },
  { href: '/about', label: 'Our Story' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { count } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    router.prefetch('/products');
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!accountOpen) return;
    const onDown = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAccountOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Account';
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-bg/95 backdrop-blur-[2px] transition-shadow duration-300',
        scrolled ? 'border-line shadow-[var(--shadow-sm)]' : 'border-transparent',
      )}
    >
      <div className="mc-container flex h-[4.75rem] items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="The Moon Charm home">
          <span className="h-8 w-8 text-primary transition-transform duration-500 group-hover:-rotate-12">
            <MoonMark />
          </span>
          <BrandName noWrap className="text-[1.15rem] leading-none" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link key={l.href} href={l.href} prefetch className="mc-navlink" data-active={active}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--r)] text-ink transition-colors hover:bg-surface"
            aria-label={`Cart${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[1.35rem] w-[1.35rem]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6" />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17.5" cy="20" r="1.4" />
            </svg>
            {count > 0 ? (
              <span className="absolute right-0.5 top-0.5 inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>

          {isAuthenticated && session?.user ? (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="mc-btn-ghost h-10"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.7rem] font-bold text-white">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[7rem] truncate sm:inline">{firstName}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={cn('h-3.5 w-3.5 transition-transform', accountOpen && 'rotate-180')}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {accountOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-[var(--r-lg)] border border-line bg-bg py-1.5 shadow-[var(--shadow-lg)]"
                >
                  <MenuLink href="/profile" onClick={() => setAccountOpen(false)}>Profile</MenuLink>
                  <MenuLink href="/orders" onClick={() => setAccountOpen(false)}>My orders</MenuLink>
                  {isAdmin ? <MenuLink href="/admin" onClick={() => setAccountOpen(false)}>Admin</MenuLink> : null}
                  <div className="my-1.5 mx-3 mc-rule" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full px-4 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="mc-btn-ghost h-10">Sign in</Link>
              <Link href="/register" className="mc-btn h-10">Create account</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--r)] text-ink transition-colors hover:bg-surface lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <div className="border-t border-line bg-bg lg:hidden">
          <div className="mc-container grid gap-1 py-4">
            <Link href="/" className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface" data-active={pathname === '/'}>
              Home
            </Link>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                prefetch
                className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface"
              >
                {l.label}
              </Link>
            ))}
            {!isAuthenticated ? (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/login" className="mc-btn-outline">Sign in</Link>
                <Link href="/register" className="mc-btn">Create account</Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function MenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="block px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {children}
    </Link>
  );
}
