export function applyDiscount(amount: number, discountPercent?: number | null) {
  if (!discountPercent) return amount;
  const discounted = amount * (1 - discountPercent / 100);
  return Math.round(discounted * 100) / 100;
}
