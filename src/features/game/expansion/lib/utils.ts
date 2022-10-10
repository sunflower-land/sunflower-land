import { LandExpansionRock } from "features/game/types/game";

export function canMine(
  rock: LandExpansionRock,
  recoveryTime: number,
  now: number = Date.now()
) {
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

export const randomBetweenMaxInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

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
