'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export type CartItem = {
  itemType: 'product' | 'package';
  refId: string;
  name: string;
  image?: string;
  unitPrice: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (refId: string, quantity: number) => void;
  removeItem: (refId: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'moon-charm.cart.v1';
let loginToastCounter = 0;

function goToLogin() {
  const nextPath = `${globalThis.location?.pathname ?? '/'}${globalThis.location?.search ?? ''}`;
  globalThis.location.href = `/login?next=${encodeURIComponent(nextPath)}`;
}

function showLoginRequiredToast() {
  loginToastCounter += 1;
  toast.error('Sign in required', {
    id: `login-required-${loginToastCounter}`,
    description:
      'Please log in to add items to your cart and continue checkout.',
    duration: 7000,
    action: {
      label: 'Log in',
      onClick: goToLogin,
    },
    cancel: {
      label: 'Not now',
      onClick: () => {},
    },
  });
}

function readStoredCart(): CartItem[] {
  if (globalThis.window === undefined) return [];
  try {
    const raw = globalThis.window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { data: session, status } = useSession();
  const canAddToCart = status !== 'loading' && Boolean(session?.user);

  useEffect(() => {
    setItems(readStoredCart());
  }, []);

  useEffect(() => {
    globalThis.window?.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      if (!canAddToCart) {
        showLoginRequiredToast();
        return;
      }

      let message = 'Added to cart';
      setItems((prev) => {
        let foundIndex = -1;
        for (let index = 0; index < prev.length; index += 1) {
          if (prev[index].refId === item.refId) {
            foundIndex = index;
            break;
          }
        }

        if (foundIndex === -1) {
          return [...prev, { ...item, quantity }];
        }

        message = 'Updated cart quantity';
        const next = prev.slice();
        const existing = next[foundIndex];
        next[foundIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
        };
        return next;
      });
      toast.success(message);
    },
    [canAddToCart],
  );

  const updateQuantity = useCallback((refId: string, quantity: number) => {
    setItems((prev) => {
      const next: CartItem[] = [];
      for (const item of prev) {
        if (item.refId !== refId) {
          next.push(item);
          continue;
        }
        if (quantity > 0) {
          next.push({ ...item, quantity });
        }
      }
      return next;
    });
  }, []);

  const removeItem = useCallback((refId: string) => {
    setItems((prev) => {
      const next: CartItem[] = [];
      for (const item of prev) {
        if (item.refId !== refId) next.push(item);
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      subtotal,
      count,
    }),
    [addItem, clear, count, items, removeItem, subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
