import type { OddsFormat } from '@/data/types';

const amount = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** Formats Naira, e.g. 2500 → "₦2,500.00". */
export function formatMoney(value: number): string {
  return `₦${amount.format(value)}`;
}

export function formatDateTime(iso: string): string {
  return dateTime.format(new Date(iso));
}

/** Formats decimal odds, e.g. 2.5 → "2.50" / "3/2" / "+150". */
export function formatOdds(odds: number, format: OddsFormat): string {
  switch (format) {
    case 'fractional':
      return toFraction(odds - 1);
    case 'american':
      return odds >= 2 ? `+${Math.round((odds - 1) * 100)}` : `${Math.round(-100 / (odds - 1))}`;
    case 'decimal':
      return odds.toFixed(2);
  }
}

/**
 * Closest fraction with a denominator up to 20, e.g. 0.45 → "9/20". Smaller denominators win
 * ties, so the result is already in lowest terms.
 */
function toFraction(value: number): string {
  let numerator = Math.round(value);
  let denominator = 1;
  let error = Math.abs(value - numerator);

  for (let candidate = 2; candidate <= 20 && error > 0.001; candidate++) {
    const candidateNumerator = Math.round(value * candidate);
    const candidateError = Math.abs(value - candidateNumerator / candidate);
    if (candidateError < error - 1e-9) {
      numerator = candidateNumerator;
      denominator = candidate;
      error = candidateError;
    }
  }

  return `${numerator}/${denominator}`;
}
