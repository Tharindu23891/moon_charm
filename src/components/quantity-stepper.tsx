'use client';

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
    <div className="inline-flex items-center rounded-[var(--r)] border border-line-strong">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => set(value - 1)}
        className="inline-flex h-10 w-10 items-center justify-center text-lg text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
      <span className="min-w-10 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => set(value + 1)}
        className="inline-flex h-10 w-10 items-center justify-center text-lg text-ink transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
