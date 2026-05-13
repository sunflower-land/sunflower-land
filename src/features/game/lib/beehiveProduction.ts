import { DEFAULT_HONEY_PRODUCTION_TIME } from "./updateBeehives";
import { Beehive, GameState } from "../types/game";

/**
 * Returns the flower currently attached to the hive (started but not yet
 * expired). Used by both the runtime xstate machine and any read-only
 * consumer that needs to know whether the hive is currently producing.
 */
export const getActiveFlower = (hive: Beehive) => {
  const now = Date.now();
  return hive.flowers.find((flower) => {
    return flower.attachedAt <= now && flower.attachedUntil > now;
  });
};

/**
 * Total honey produced by a hive as of now. Pure read against the hive's
 * attached flower history — no game-state mutation.
 */
export const getCurrentHoneyProduced = (hive: Beehive) => {
  const attachedFlowers = hive.flowers
    .slice()
    .sort((a, b) => a.attachedAt - b.attachedAt);

  return attachedFlowers.reduce((produced, attachedFlower) => {
    const start = Math.max(hive.honey.updatedAt, attachedFlower.attachedAt);
    const end = Math.min(Date.now(), attachedFlower.attachedUntil);

    // Prevent future dates
    const honey = Math.max(end - start, 0) * (attachedFlower.rate ?? 1);

    return (produced += honey);
  }, hive.honey.produced);
};

/**
 * Current honey-production speed (sum of rates of all currently-active
 * attached flowers).
 */
export const getCurrentSpeed = (hive: Beehive) => {
  const attachedFlowers = hive.flowers
    .slice()
    .sort((a, b) => a.attachedAt - b.attachedAt);

  return attachedFlowers.reduce((rate, attachedFlower) => {
    if (
      attachedFlower.attachedUntil <= Date.now() ||
      attachedFlower.attachedAt > Date.now()
    )
      return rate;

    return (rate += attachedFlower.rate ?? 1);
  }, 0);
};

export function areBeehivesEmpty(game: GameState): boolean {
  const allBeehivesNearlyEmpty = Object.values(game.beehives).every(
    (hive) =>
      getCurrentHoneyProduced(hive) <= DEFAULT_HONEY_PRODUCTION_TIME * 0.01,
  );
  return allBeehivesNearlyEmpty;
}
