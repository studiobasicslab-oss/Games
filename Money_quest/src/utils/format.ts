/**
 * Money Quest — Formatting Utilities
 * Indian currency, number, and date formatting helpers
 */

/**
 * Format a number as Indian Rupees (₹XX,XX,XXX)
 */
export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    // Format in crores
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    // Format in lakhs
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as Indian Rupees with full precision (no abbreviation)
 */
export function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number as compact Indian representation
 */
export function formatCompact(amount: number): string {
  if (Math.abs(amount) >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (Math.abs(amount) >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toFixed(0);
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format percentage from already-percentage value (e.g. 12.5 -> "12.5%")
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Convert game month to age and calendar month
 */
export function monthToAge(gameMonth: number, startAge: number = 22): { age: number; month: number; year: number } {
  const totalMonths = gameMonth - 1; // 0-indexed
  const yearsElapsed = Math.floor(totalMonths / 12);
  const monthInYear = (totalMonths % 12) + 1;
  return {
    age: startAge + yearsElapsed,
    month: monthInYear,
    year: 2024 + yearsElapsed,
  };
}

/**
 * Get month name from month number (1-12)
 */
export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[(month - 1) % 12];
}

/**
 * Get short month name
 */
export function getMonthShort(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[(month - 1) % 12];
}

/**
 * Format a change with + or - prefix and color indicator
 */
export function formatChange(amount: number): { text: string; color: string; isPositive: boolean } {
  const isPositive = amount >= 0;
  return {
    text: `${isPositive ? '+' : ''}${formatCurrency(amount)}`,
    color: isPositive ? 'text-emerald-400' : 'text-rose-400',
    isPositive,
  };
}

/**
 * Format number with Indian comma separators
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(Math.round(num));
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Round to 2 decimal places (for currency precision)
 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get credit score rating label
 */
export function getCreditScoreLabel(score: number): { label: string; color: string } {
  if (score >= 800) return { label: 'Excellent', color: 'text-emerald-400' };
  if (score >= 700) return { label: 'Good', color: 'text-green-400' };
  if (score >= 600) return { label: 'Fair', color: 'text-amber-400' };
  if (score >= 500) return { label: 'Poor', color: 'text-orange-400' };
  return { label: 'Very Poor', color: 'text-rose-400' };
}

/**
 * Get risk level color
 */
export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'low': return 'text-emerald-400';
    case 'medium': return 'text-amber-400';
    case 'high': return 'text-orange-400';
    case 'very_high': return 'text-rose-400';
    default: return 'text-slate-400';
  }
}
