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
  return num.toString().padStart(totalLength, '0');
}

