/**
 * Format a number with commas for readability
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with commas
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format a number as currency with $ symbol
 */
export const formatDollar = (value: number, decimals: number = 2): string => {
  return `$${formatCurrency(value, decimals)}`;
};
