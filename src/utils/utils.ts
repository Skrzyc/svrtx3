/**
 * Clamps a value
 * @example
 * clamp(3, 5, 10) -> 5
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(Math.min(max, value), min);
}

/**
 * Adds leading zeros
 * @example
 * addLeadingZeros(150, 5) -> '00150'
 */
export function addLeadingZeros(num: number, totalLength: number): string {
  return num.toString().padStart(totalLength, "0");
}

/**
 *
 * @param {string} value
 * @returns {string}
 *
 * @example
 * addThousandsSpacing('50320') -> '50 320'
 */
export function addThousandsSpacing(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Delays execution for a given number of milliseconds
 * @example
 * await delayMs(2000);
 */
export function delayMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
