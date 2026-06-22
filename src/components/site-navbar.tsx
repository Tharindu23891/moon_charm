'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { BrandName } from '@/components/brand-name';
import { MoonMark } from '@/components/moon-mark';
import { popSpring, easeOut } from '@/components/motion/transitions';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const links = [
  { href: '/', label: 'Home' },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    router.prefetch('/products');
  }, [router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Account';
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === 'admin';

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b bg-bg/95 backdrop-blur-[2px] transition-shadow duration-300',
        scrolled
          ? 'border-line shadow-[var(--shadow-sm)]'
          : 'border-transparent',
      )}
    >
      <div className="mc-container flex h-[4.75rem] items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="The Moon Charm home"
        >
          <span className="h-8 w-8 text-primary transition-transform duration-500 group-hover:-rotate-12">
            <motion.span
              className="block h-full w-full"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              <MoonMark />
            </motion.span>
          </span>
          <BrandName noWrap className="text-[1.15rem] leading-none" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                prefetch
                className="mc-navlink"
                data-active={active}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--r)] text-ink transition-colors hover:bg-surface"
            aria-label={`Cart${count > 0 ? `, ${count} item${count === 1 ? '' : 's'}` : ''}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-[1.35rem] w-[1.35rem]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 7H6"
              />
              <circle cx="9.5" cy="20" r="1.4" />
              <circle cx="17.5" cy="20" r="1.4" />
            </svg>
            {count > 0 ? (
              // Keyed on count so it re-mounts and re-pops each time the count
              // changes — clear feedback that an item landed in the cart.
              <motion.span
                key={count}
                className="absolute top-0.5 right-0.5 inline-flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full bg-claret px-1 text-[0.65rem] font-bold text-white"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={popSpring}
              >
                {count}
              </motion.span>
            ) : null}
          </Link>

          {isAuthenticated && session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[0.7rem] font-bold text-primary-foreground">
                    {firstName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[7rem] truncate sm:inline">
                    {firstName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My orders</Link>
                </DropdownMenuItem>
                {isAdmin ? (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="h-10">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="h-10">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[85vw] p-0">
              <SheetHeader className="border-b border-line">
                <SheetTitle className="flex items-center gap-2 text-left">
                  <span className="h-6 w-6 text-primary">
                    <MoonMark />
                  </span>
                  <BrandName noWrap className="text-base" />
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-1 p-4">
                {links.map((l) => (
                  <SheetClose key={l.href} asChild>
                    <Link
                      href={l.href}
                      className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
                {!isAuthenticated ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <SheetClose asChild>
                      <Button asChild variant="outline">
                        <Link href="/login">Sign in</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild>
                        <Link href="/register">Create account</Link>
                      </Button>
                    </SheetClose>
                  </div>
                ) : (
                  <>
                    <div className="mc-rule my-2" />
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface"
                      >
                        Profile
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/orders"
                        className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface"
                      >
                        My orders
                      </Link>
                    </SheetClose>
                    {isAdmin ? (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-ink hover:bg-surface"
                        >
                          Admin
                        </Link>
                      </SheetClose>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="h-auto w-full justify-start rounded-[var(--r)] px-3 py-2.5 text-[0.95rem] font-medium text-muted-foreground hover:bg-surface hover:text-ink"
                    >
                      Sign out
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
