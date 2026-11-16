import { PATCH_FRUIT, PATCH_FRUIT_SEEDS } from "features/game/types/fruits";
import type {
  FruitFertiliser,
  GameState,
  PlantedFruit,
} from "features/game/types/game";
import {
  computeReadyAt,
  getFruitBoostWindows,
  getTurbofruitMixWindows,
} from "features/game/lib/boostWindows";

/**
 * The instant a planted fruit is ready to harvest: the active phase's start
 * (`harvestedAt || plantedAt`) plus `baseDurationMs` of work, derived live from
 * the fruit boost windows and the patch's Turbofruit Mix. A fruit with no marker
 * reads as the raw grow time.
 */
export const getFruitReadyAt = (
  plantedFruit: PlantedFruit,
  game: GameState,
  fertiliser?: FruitFertiliser,
): number => {
  const { seed } = PATCH_FRUIT[plantedFruit.name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  const startedAt = plantedFruit.harvestedAt || plantedFruit.plantedAt;

  return computeReadyAt({
    startedAt,
    baseDurationMs: plantedFruit.baseDurationMs ?? plantSeconds * 1000,
    windows: [
      ...getFruitBoostWindows(game),
      ...getTurbofruitMixWindows(fertiliser),
    ],
  });
};

export const isFruitReadyToHarvest = (
  now: number,
  plantedFruit: PlantedFruit,
  game: GameState,
  fertiliser?: FruitFertiliser,
): boolean => now >= getFruitReadyAt(plantedFruit, game, fertiliser);
