/**
 * Formats a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "₦5,000")
 */
export function formatAmount(
  amount: number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

/**
 * Formats a currency amount with 'm' suffix for millions
 * @param value - The amount to format
 * @returns Formatted currency string (e.g., "₦2.898m" for 2898000)
 */
export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `₦${millions.toFixed(3)}m`;
  }
  return formatAmount(value);
}
