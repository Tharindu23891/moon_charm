import Image from 'next/image';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { GiftPackage } from '@/models/GiftPackage';
import { PackagePurchasePanel } from '@/components/package/package-purchase-panel';

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectToDatabase();
  const pkg = await GiftPackage.findById(id).populate('items.productId').lean();

  if (!pkg) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="rounded-2xl border bg-white p-8 text-sm text-neutral-600">
          Package not found.
        </div>
      </div>
    );
  }

  const image =
    (pkg as any).image ||
    'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1200&q=60';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="text-sm text-neutral-600">
        <Link href="/packages" className="hover:text-neutral-900">
          Packages
        </Link>
        <span> / </span>
        <span className="text-neutral-900">{(pkg as any).name}</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border bg-neutral-50">
          <Image src={image} alt={(pkg as any).name} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {(pkg as any).name}
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              A curated bundle with everything you need.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-medium">Included items</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {((pkg as any).items ?? []).map((it: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{it.productId?.name ?? 'Item'}</span>
                  <span className="text-neutral-600">×{it.quantity}</span>
                </li>
              ))}
              {((pkg as any).items ?? []).length === 0 ? (
                <li className="text-neutral-600">—</li>
              ) : null}
            </ul>
          </div>

          <PackagePurchasePanel
            pkg={{
              id: (pkg as any)._id.toString(),
              name: (pkg as any).name,
              image,
              price: (pkg as any).price,
              discountPercent: (pkg as any).discountPercent ?? null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
