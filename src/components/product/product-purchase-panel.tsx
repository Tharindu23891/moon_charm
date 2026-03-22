'use client';

import { useState } from 'react';
import { AddToCartButton } from '@/components/cart/add-to-cart-button';

export function ProductPurchasePanel({
  product,
}: {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
}) {
  const [qty, setQty] = useState(1);

  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="text-sm font-medium">Purchase</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-neutral-600">Price</div>
        <div className="text-lg font-semibold">${product.price.toFixed(2)}</div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-sm text-neutral-600">Quantity</div>
        <input
          type="number"
          min={1}
          max={Math.max(1, product.stock)}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          className="w-24 rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-4">
        <AddToCartButton
          quantity={qty}
          disabled={product.stock <= 0}
          item={{
            itemType: 'product',
            refId: product.id,
            name: product.name,
            image: product.image,
            unitPrice: product.price,
          }}
        />
      </div>
      <div className="mt-3 text-xs text-neutral-600">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </div>
    </div>
  );
}
