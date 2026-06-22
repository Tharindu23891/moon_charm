'use client';

import { Button } from '@/components/ui/button';

type QuantityStepperProps = Readonly<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}>;

export function QuantityStepper({ value, onChange, min = 1, max = 99, disabled }: QuantityStepperProps) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v)));

  return (
    <div className="inline-flex items-center overflow-hidden rounded-[var(--r)] border border-line-strong">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => set(value - 1)}
        className="h-10 w-10 rounded-none text-lg"
      >
        −
      </Button>
      <span className="min-w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => set(value + 1)}
        className="h-10 w-10 rounded-none text-lg"
      >
        +
      </Button>
    </div>
  );
}
