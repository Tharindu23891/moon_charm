'use client';

import { useCart, type CartItem } from '@/components/cart/cart-context';
import { cn } from '@/lib/cn';

type AddToCartButtonProps = Readonly<{
  item: Omit<CartItem, 'quantity'>;
  quantity?: number;
  disabled?: boolean;
  /** solid (default), outline, or a compact circular icon for card footers. */
  variant?: 'solid' | 'outline' | 'icon';
  fullWidth?: boolean;
  label?: string;
  className?: string;
}>;

export function AddToCartButton({
  item,
  quantity = 1,
  disabled,
  variant = 'solid',
  fullWidth,
  label = 'Add to cart',
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const onClick = () => addItem(item, quantity);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-label={disabled ? `${item.name} is sold out` : `Add ${item.name} to cart`}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg/90 text-ink shadow-[var(--shadow-sm)] backdrop-blur-sm transition-colors duration-300',
          'hover:border-primary hover:bg-primary hover:text-white',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:hover:bg-bg/90 disabled:hover:text-ink',
          className,
        )}
      >
        <PlusIcon />
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(variant === 'outline' ? 'mc-btn-outline' : 'mc-btn', fullWidth && 'w-full', className)}
    >
      <PlusIcon />
      {label}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[1.05rem] w-[1.05rem]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
    </svg>
  );
}
