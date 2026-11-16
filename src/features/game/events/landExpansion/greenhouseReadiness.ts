import type {
  GameState,
  GreenhouseFertiliser,
  GreenhousePlant,
  GreenhousePot,
} from "features/game/types/game";
import {
  computeReadyAt,
  getGreenhouseBoostWindows,
  getGreenhouseGlowWindows,
} from "features/game/lib/boostWindows";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";

/**
 * The instant a greenhouse plant is ready to harvest: `plantedAt` plus
 * `baseDurationMs` of work, derived live from the greenhouse boost windows
 * (totems / Tortoise Shrine / Harvest Hourglass for the crops + the pot's
 * Greenhouse Glow fertiliser). A plant with no marker reads as the raw grow time.
 */
export const getGreenhouseReadyAt = (
  plant: GreenhousePlant,
  game: GameState,
  fertiliser?: GreenhouseFertiliser,
): number => {
  return computeReadyAt({
    startedAt: plant.plantedAt,
    baseDurationMs:
      plant.baseDurationMs ?? GREENHOUSE_CROP_TIME_SECONDS[plant.name] * 1000,
    windows: [
      ...getGreenhouseBoostWindows(game, plant.name),
      ...getGreenhouseGlowWindows(fertiliser),
    ],
  });
};

export const getGreenhousePotReadyAt = (pot: GreenhousePot, game: GameState) =>
  pot.plant ? getGreenhouseReadyAt(pot.plant, game, pot.fertiliser) : undefined;

export const isGreenhouseReady = (
  now: number,
  pot: GreenhousePot,
  game: GameState,
): boolean => {
  const readyAt = getGreenhousePotReadyAt(pot, game);
  return readyAt !== undefined && now >= readyAt;
};
