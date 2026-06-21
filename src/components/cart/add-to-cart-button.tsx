'use client';

import { useCart, type CartItem } from '@/components/cart/cart-context';
import { Button } from '@/components/ui/button';
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
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={disabled}
        onClick={onClick}
        aria-label={disabled ? `${item.name} is sold out` : `Add ${item.name} to cart`}
        className={cn(
          'rounded-full bg-bg/90 shadow-[var(--shadow-sm)] backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-primary-foreground',
          className,
        )}
      >
        <PlusIcon />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant === 'outline' ? 'outline' : 'default'}
      disabled={disabled}
      onClick={onClick}
      className={cn(fullWidth && 'w-full', className)}
    >
      <PlusIcon />
      {label}
    </Button>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[1.05rem] w-[1.05rem]">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
    </svg>
  );
}
