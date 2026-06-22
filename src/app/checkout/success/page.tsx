'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buildWhatsAppUrl } from '@/lib/whatsapp-link';

export default function CheckoutSuccessPage() {
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const opened = useRef(false);

  useEffect(() => {
    let message: string | null = null;
    try {
      message = sessionStorage.getItem('mc_order_wa');
      sessionStorage.removeItem('mc_order_wa');
    } catch {
      message = null;
    }
    if (!message) return;

    const url = buildWhatsAppUrl(message);
    setWaUrl(url);

    // Best-effort: pop WhatsApp open automatically. The button below is the
    // reliable path whenever a browser blocks this auto-open.
    if (!opened.current) {
      opened.current = true;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  return (
    <div className="mc-container py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path
              d="m5 13 4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h1 className="mt-6 font-display text-[clamp(2rem,4vw,2.8rem)]">
          Order placed
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you. One last step: send us your order on WhatsApp so we can
          confirm the details and arrange delivery.
        </p>

        {waUrl ? (
          <Button asChild size="lg" className="mt-8 gap-2.5">
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Send my order on WhatsApp
            </a>
          </Button>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            Your order is saved. You can review it in your orders any time.
          </p>
        )}

        <p className="mt-6 text-sm">
          <Link
            href="/orders"
            className="text-muted-foreground underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            View your orders
          </Link>
        </p>
      </div>
    </div>
  );
}
