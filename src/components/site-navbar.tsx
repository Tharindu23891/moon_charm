'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useCart } from '@/components/cart/cart-context';
import { BrandName } from '@/components/brand-name';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/packages', label: 'Packages' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { count } = useCart();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    router.prefetch('/products');
  }, [router]);

  const navLinkClass = (active: boolean) =>
    `relative text-sm font-medium transition-colors ${
      active ? 'text-neutral-900' : 'text-neutral-700/80'
    } hover:text-neutral-900 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gradient-to-r after:from-violet-500 after:via-fuchsia-500 after:to-rose-500 after:transition-all after:duration-300 hover:after:w-full`;

  let accountControls: React.ReactNode;
  if (isAuthenticated && session?.user) {
    accountControls = (
      <div className="relative">
        <button
          type="button"
          onClick={() => setAccountOpen((v) => !v)}
          className="mc-btn h-10 px-4"
        >
          {session.user.name ?? 'Account'}
        </button>
        {accountOpen ? (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl shadow-violet-200/40">
            <Link
              href="/profile"
              onClick={() => setAccountOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-white/60"
            >
              Profile
            </Link>
            <Link
              href="/orders"
              onClick={() => setAccountOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-white/60"
            >
              Orders
            </Link>
            {(session.user as any).role === 'admin' ? (
              <Link
                href="/admin"
                onClick={() => setAccountOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-white/60"
              >
                Admin
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setAccountOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="block w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-800 hover:bg-white/60"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    );
  } else {
    accountControls = (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="mc-btn-outline h-10 px-4"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="mc-btn h-10 px-4"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-xl">
      <div className="mc-container flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-base font-extrabold tracking-tight">
            <span className="relative inline-flex h-10 w-10 overflow-hidden rounded-full border border-white/60 shadow-sm shadow-violet-100/40">
              <Image
                src="/about/logo.jpeg"
                alt="The Moon Charm logo"
                fill
                className="object-cover"
                sizes="40px"
              />
            </span>
            <BrandName noWrap />
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  prefetch
                  className={navLinkClass(active)}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/60 backdrop-blur shadow-sm shadow-violet-100/40 transition-all duration-300 hover:bg-white/80 hover:shadow-md hover:shadow-violet-200/40"
            aria-label="Cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5 text-neutral-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2m6 18a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-rose-200">
                {count}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/60 backdrop-blur shadow-sm shadow-violet-100/40 transition-all duration-300 hover:bg-white/80 md:hidden"
            aria-label="Menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-neutral-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {accountControls}
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/40 bg-white/55 backdrop-blur-xl md:hidden">
          <div className="mc-container py-3">
            <nav className="grid gap-2">
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    prefetch
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-white/70 text-neutral-900' : 'text-neutral-800 hover:bg-white/60'
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
