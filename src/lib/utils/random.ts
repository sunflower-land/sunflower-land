/**
 * Generate a random boolean.
 * @returns A random boolean.
 */
export const randomBoolean = () => {
  return Math.random() < 0.5;
};

/**
 * Generate a random floating point number. The maximum is exclusive and the minimum is inclusive.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A random floating point number.
 */
export const randomDouble = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate a random ID.
 * @returns A random ID.
 */
export const randomID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return "_" + Math.random().toString(36).substring(2, 9);
};

/**
 * Generate a random integer. The maximum is exclusive and the minimum is inclusive.
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A random integer.
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
