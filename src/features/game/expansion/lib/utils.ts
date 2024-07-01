import { Rock } from "features/game/types/game";

export function canMine(
  rock: Rock,
  recoveryTime: number,
  now: number = Date.now(),
) {
  return now - rock.stone.minedAt > recoveryTime * 1000;
}
