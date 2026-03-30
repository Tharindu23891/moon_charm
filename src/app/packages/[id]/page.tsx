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
      <div className="mc-container py-10">
        <div className="mc-card p-8 text-sm text-zinc-600">
          Package not found.
        </div>
      </div>
    );
  }

  const image =
    (pkg as any).image ||
    'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1200&q=60';

  return (
    <div className="mc-container py-10">
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
        <Link href="/packages" className="mc-pill hover:bg-white">
          Packages
        </Link>
        <span className="text-zinc-400">/</span>
        <span className="font-medium text-zinc-900">{(pkg as any).name}</span>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="mc-card relative aspect-[4/3] overflow-hidden p-0">
          <Image src={image} alt={(pkg as any).name} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              <span className="mc-text-gradient">{(pkg as any).name}</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              A curated bundle with everything you need.
            </p>
          </div>

          <div className="mc-card p-5">
            <div className="text-sm font-medium">Included items</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {((pkg as any).items ?? []).map((it: any, idx: number) => (
                <li key={idx} className="flex items-center justify-between">
                  <span>{it.productId?.name ?? 'Item'}</span>
                  <span className="text-zinc-600">×{it.quantity}</span>
                </li>
              ))}
              {((pkg as any).items ?? []).length === 0 ? (
                <li className="text-zinc-600">—</li>
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
