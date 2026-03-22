'use client';

import { useCart, type CartItem } from '@/components/cart/cart-context';

export function AddToCartButton({
  item,
  quantity = 1,
  disabled,
}: {
  item: Omit<CartItem, 'quantity'>;
  quantity?: number;
  disabled?: boolean;
}) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(item, quantity)}
      className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
    >
      Add to cart
    </button>
  );
}
