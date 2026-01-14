/**
 * Formats a numeric string for currency input display
 * Removes all non-numeric characters and formats with commas
 * @param value - The input string to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export function formatCurrencyInput(value: string): string {
  // Remove all non-numeric characters
  const numericValue = value.replace(/[^0-9]/g, '');
  
  if (!numericValue) return '';
  
  // Convert to number and format with commas
  return parseInt(numericValue, 10).toLocaleString('en-NG');
}

/**
 * Parses a formatted currency string back to a numeric value
 * @param formattedValue - The formatted string (e.g., "1,234,567")
 * @returns The numeric value as a string (e.g., "1234567")
 */
export function parseCurrencyInput(formattedValue: string): string {
  // Remove all non-numeric characters
  return formattedValue.replace(/[^0-9]/g, '');
}

/**
 * Formats a number for currency input display
 * @param value - The number to format
 * @returns Formatted string with commas (e.g., "1,234,567")
 */
export function formatNumberForInput(value: number): string {
  if (!value || value === 0) return '';
  return value.toLocaleString('en-NG');
}
