/**
 * Money Quest — Random Number Utilities
 * Probability, weighted selection, and statistical distributions
 */

/**
 * Generate a random number between min and max (inclusive)
 */
export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return true with the given probability (0-1)
 */
export function chance(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Box-Muller transform: Generate a normally distributed random number
 * @param mean - Mean of the distribution
 * @param stdDev - Standard deviation
 * @returns A random number from N(mean, stdDev)
 */
export function normalRandom(mean: number = 0, stdDev: number = 1): number {
  const u1 = Math.random() || 0.0001;
  const u2 = Math.random() || 0.0001;
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Select a random item from an array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Weighted random selection from items with weights
 */
export function weightedRandom<T>(items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Simulate a monthly investment return with realistic volatility
 * Uses log-normal distribution (more accurate for financial returns)
 * @param annualReturn - Expected annual return (e.g. 0.12 for 12%)
 * @param annualVolatility - Annual volatility/std dev (e.g. 0.18 for 18%)
 * @returns Monthly return multiplier (e.g. 1.01 for +1%)
 */
export function simulateMonthlyReturn(annualReturn: number, annualVolatility: number): number {
  const monthlyReturn = annualReturn / 12;
  const monthlyVolatility = annualVolatility / Math.sqrt(12);
  const z = normalRandom();
  return monthlyReturn + monthlyVolatility * z;
}

/**
 * Generate a correlated return based on market return
 * @param marketReturn - The market's return this month
 * @param beta - How correlated this asset is to the market (1 = same, 0.5 = half)
 * @param alpha - Extra return independent of market
 * @param specificVolatility - Additional randomness specific to this asset
 */
export function correlatedReturn(
  marketReturn: number,
  beta: number,
  alpha: number = 0,
  specificVolatility: number = 0.05
): number {
  const specificReturn = normalRandom(0, specificVolatility / Math.sqrt(12));
  return alpha / 12 + beta * marketReturn + specificReturn;
}
