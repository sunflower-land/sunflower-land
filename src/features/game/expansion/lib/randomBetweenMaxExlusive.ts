/**
 * Returns an random integer. The maximum is exclusive and the minimum is inclusive.
 * @param min number
 * @param max number
 * @returns number
 */
export function randomBetweenMaxExclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
