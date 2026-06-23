const FORMATTER = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function toCents(input: string | number): number {
  const value = typeof input === 'number' ? input : Number.parseFloat(input);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatMoney(cents: number): string {
  return FORMATTER.format(cents / 100);
}
