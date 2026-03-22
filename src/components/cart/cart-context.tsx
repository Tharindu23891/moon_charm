'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

function readStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(readStoredCart());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
    const count = items.reduce((sum, it) => sum + it.quantity, 0);

    function addItem(item: Omit<CartItem, 'quantity'>, quantity = 1) {
      setItems((prev) => {
        const existing = prev.find((p) => p.refId === item.refId);
        if (!existing) {
          toast.success('Added to cart');
          return [...prev, { ...item, quantity }];
        }
        toast.success('Updated cart quantity');
        return prev.map((p) =>
          p.refId === item.refId ? { ...p, quantity: p.quantity + quantity } : p
        );
      });
    }

    function updateQuantity(refId: string, quantity: number) {
      setItems((prev) =>
        prev
          .map((p) => (p.refId === refId ? { ...p, quantity } : p))
          .filter((p) => p.quantity > 0)
      );
    }

    function removeItem(refId: string) {
      setItems((prev) => prev.filter((p) => p.refId !== refId));
    }

    function clear() {
      setItems([]);
    }

    return { items, addItem, updateQuantity, removeItem, clear, subtotal, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
