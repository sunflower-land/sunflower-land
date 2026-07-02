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
 * The instant a greenhouse plant is ready to harvest, across both boost models.
 * Plants sown under the speed-rate model (with `baseDurationMs`) derive their
 * ready time live from the greenhouse boost windows (totems / Tortoise Shrine /
 * Harvest Hourglass for the crops + the pot's Greenhouse Glow fertiliser);
 * legacy plants use their back-dated `plantedAt` + base grow duration.
 *
 * `baseDurationMs` is a PERMANENT per-plant migration marker: the read path
 * keys off its presence, NOT the `SPEED_BOOSTS` flag (matching
 * `getFruitReadyAt` / `getCropReadyAt`) — see `GreenhousePlant.baseDurationMs`.
 */
export const getGreenhouseReadyAt = (
  plant: GreenhousePlant,
  game: GameState,
  fertiliser?: GreenhouseFertiliser,
): number => {
  if (plant.baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt: plant.plantedAt,
      baseDurationMs: plant.baseDurationMs,
      windows: [
        ...getGreenhouseBoostWindows(game, plant.name),
        ...getGreenhouseGlowWindows(fertiliser),
      ],
    });
  }

  return plant.plantedAt + GREENHOUSE_CROP_TIME_SECONDS[plant.name] * 1000;
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
