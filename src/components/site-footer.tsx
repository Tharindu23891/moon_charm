import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold">Moon Charm</div>
          <p className="mt-2 text-sm text-neutral-600">
            Gifts and packages for every occasion.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium">Links</div>
          <div className="mt-2 grid gap-2 text-neutral-600">
            <Link href="/products" className="hover:text-neutral-900">
              Products
            </Link>
            <Link href="/packages" className="hover:text-neutral-900">
              Packages
            </Link>
            <Link href="/categories" className="hover:text-neutral-900">
              Categories
            </Link>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">Contact</div>
          <div className="mt-2 grid gap-1 text-neutral-600">
            <div>Email: support@mooncharm.example</div>
            <div>Phone: +1 (000) 000-0000</div>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Moon Charm
      </div>
    </footer>
  );
}
