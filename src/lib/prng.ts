/**
 * A PRNG implementation that uses a 32-bit MurmurHash3 algorithm to generate a random number between 0 and 1.
 * @param farmId - The farm ID
 * @param itemId - The item ID
 * @param counter - The counter
 * @returns A random number between 0 and 1
 */
export const prng = ({
  farmId,
  itemId,
  counter,
}: {
  farmId: number;
  itemId: number;
  counter: number;
}) => {
  // Combine seed, stream, and index into a 32-bit state with imul on seed
  const seed =
    (Math.imul(farmId, 0x85ebca6b) +
      Math.imul(itemId, 0x9e3779b9) +
      Math.imul(counter, 0x27d4eb2f)) >>>
    0;

  // Mix bits (32-bit MurmurHash3 style)
  let t = seed ^ (seed >>> 16);
  t = Math.imul(t, 0x21f0aaad);
  t = t ^ (t >>> 15);
  t = Math.imul(t, 0x735a2d97);

  const value = ((t = t ^ (t >>> 15)) >>> 0) / 2 ** 32;

  return value;
};
