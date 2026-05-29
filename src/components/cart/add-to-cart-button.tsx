'use client';

import { useCart, type CartItem } from '@/components/cart/cart-context';

export function AddToCartButton({
  item,
  quantity = 1,
  disabled,
}: Readonly<{
  item: Omit<CartItem, 'quantity'>;
  quantity?: number;
  disabled?: boolean;
}>) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(item, quantity)}
      className="mc-btn"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14m7-7H5"
        />
      </svg>
      Add to cart
    </button>
  );
}
