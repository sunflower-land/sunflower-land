import { CriticalHitName } from "features/game/types/game";
import { stringToInteger } from "./utils/stringToInteger";

/**
 * A PRNG implementation that uses a 32-bit MurmurHash3 algorithm to generate a random number between 0 and 1.
 * @param farmId - The farm ID
 * @param itemId - The item ID or node ID
 * @param counter - The counter based on farm/bumpkin activity
 * @returns A random number between 0 and 1
 * 0x85ebca6b MurmurHash3 initialisation constant, used to imul on farmId
 * 0x9e3779b9 Golden Ratio, used to imul on itemId
 * 0x27d4eb2f MurmurHash3 finalisation constant, used to imul on counter
 * 0x21f0aaad MurmurHash3 mixing constant, used to imul on seed
 * 0x735a2d97 MurmurHash3 mixing constant, used to imul on seed
 * 0x517cc1b7 MurmurHash3 mixing constant, used to imul on criticalHitNameHash
 */
export const prng = ({
  farmId,
  itemId,
  counter,
  criticalHitName,
}: {
  farmId: number;
  itemId: number;
  counter: number;
  criticalHitName: CriticalHitName;
}) => {
  const criticalHitNameHash = stringToInteger(criticalHitName);
  // Combine seed, stream, and index into a 32-bit state with imul on seed
  const seed =
    (Math.imul(farmId, 0x85ebca6b) +
      Math.imul(itemId, 0x9e3779b9) +
      Math.imul(counter, 0x27d4eb2f) +
      Math.imul(criticalHitNameHash, 0x517cc1b7)) >>>
    0;

  // Mix bits (32-bit MurmurHash3 style)
  let t = seed ^ (seed >>> 16);
  t = Math.imul(t, 0x21f0aaad);
  t = t ^ (t >>> 15);
  t = Math.imul(t, 0x735a2d97);

  const value = ((t = t ^ (t >>> 15)) >>> 0) / 2 ** 32;

  return value;
};

/**
 *
 * @param farmId - The farm ID
 * @param itemId - The item ID or node ID
 * @param counter - The counter based on farm/bumpkin activity
 * @param chance - The % chance of the event (0-100)
 * @returns True if the event occurs, false otherwise
 */
export function prngChance({
  farmId,
  itemId,
  counter,
  chance,
  criticalHitName,
}: {
  farmId: number;
  itemId: number;
  counter: number;
  chance: number;
  criticalHitName: CriticalHitName;
}) {
  const prngValue = prng({ farmId, itemId, counter, criticalHitName });

  return prngValue * 100 < chance;
}
