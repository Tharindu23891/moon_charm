export function formatLkr(amount: number) {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'code',
      minimumFractionDigits: Number.isInteger(safeAmount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  } catch {
    return `LKR ${safeAmount.toFixed(2)}`;
  }
}
