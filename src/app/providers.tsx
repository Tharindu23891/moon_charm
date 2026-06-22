'use client';

import { MotionConfig } from 'motion/react';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/components/cart/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {/* `reducedMotion="user"` makes every Motion component honour the OS
          preference automatically; our primitives layer on their own skips. */}
      <MotionConfig reducedMotion="user">
        <CartProvider>{children}</CartProvider>
      </MotionConfig>
    </SessionProvider>
  );
}
