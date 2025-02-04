import { Rock } from "features/game/types/game";

export function canMine(
  rock: Rock,
  recoveryTime: number,
  now: number = Date.now(),
) {
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

/**
 * getEntries is a ref to Object.entries, but the return is typed literally.
 */
export const getEntries = Object.entries as <T extends object>(
  obj: T,
) => Array<[keyof T, T[keyof T]]>;
