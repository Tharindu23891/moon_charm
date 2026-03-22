'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useCart } from '@/components/cart/cart-context';

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
  const { data: session, status } = useSession();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Moon Charm
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm ${
                    active ? 'text-neutral-900' : 'text-neutral-600'
                  } hover:text-neutral-900`}
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
            className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Cart{count > 0 ? ` (${count})` : ''}
          </Link>

          {status === 'loading' ? (
            <div className="h-9 w-20 rounded-lg bg-neutral-100" />
          ) : session?.user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
              >
                {session.user.name ?? 'Account'}
              </button>
              {open ? (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border bg-white shadow-sm">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-neutral-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-neutral-50"
                  >
                    Orders
                  </Link>
                  {(session.user as any).role === 'admin' ? (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm hover:bg-neutral-50"
                    >
                      Admin
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-neutral-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
