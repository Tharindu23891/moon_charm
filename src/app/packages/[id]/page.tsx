import Image from 'next/image';
import Link from 'next/link';
import { connectToDatabase } from '@/lib/mongoose';
import { GiftPackage } from '@/models/GiftPackage';
import { PackagePurchasePanel } from '@/components/package/package-purchase-panel';
import { Breadcrumb } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await connectToDatabase();
  const pkg = await GiftPackage.findById(id).populate('items.productId').lean();

  if (!pkg) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">We can’t find that package</h1>
        <p className="mt-3 text-muted-foreground">It may have sold out or been moved.</p>
        <Button asChild className="mt-6"><Link href="/packages">Back to packages</Link></Button>
      </div>
    );
  }

  const p = pkg as any;
  const image = p.image || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=70';
  const items: any[] = p.items ?? [];

  return (
    <div className="mc-container py-8 md:py-12">
      <Breadcrumb
        items={[{ href: '/', label: 'Home' }, { href: '/packages', label: 'Gift packages' }, { label: p.name }]}
      />

      <div className="mt-7 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-xl)] bg-surface">
          <Image src={image} alt={p.name} fill priority sizes="(max-width: 768px) 100vw, 560px" className="object-cover" />
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <Badge variant="blush">Gift package</Badge>
          <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05]">{p.name}</h1>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-muted-foreground">
            A curated bundle, assembled and wrapped by hand as one considered gift.
          </p>

          {items.length > 0 ? (
            <div className="mt-6 rounded-[var(--r-lg)] border border-line bg-bg p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">What’s inside</p>
              <ul className="mt-3 divide-y divide-line">
                {items.map((it, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="text-ink">{it.productId?.name ?? 'Gift item'}</span>
                    <span className="text-muted-foreground">×{it.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6">
            <PackagePurchasePanel
              pkg={{
                id: p._id.toString(),
                name: p.name,
                image,
                price: p.price,
                discountPercent: p.discountPercent ?? null,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
