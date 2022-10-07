/**
 * Returns an random decimal number.
 * @param min number
 * @param max number
 * @returns number
 */
export const randomDouble = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

/**
 * Returns an random integer. The maximum is exclusive and the minimum is inclusive.
 * @param min number
 * @param max number
 * @returns number
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
