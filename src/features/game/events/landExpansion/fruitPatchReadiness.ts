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
 * The instant a planted fruit is ready to harvest, across both boost models.
 * Fruit planted/harvested under the speed-rate model (with `baseDurationMs`)
 * derive their ready time live from the fruit boost windows (totems / Orchard
 * Hourglass / Toucan Shrine + the patch's Turbofruit Mix fertiliser); legacy
 * fruit use their back-dated plant/harvest time + base grow duration. Reads off
 * whichever phase is active (`harvestedAt || plantedAt`).
 *
 * `baseDurationMs` is a PERMANENT per-fruit migration marker: the read path keys
 * off its presence (matching `getTreeReadyAt` / `getCropReadyAt`), so
 * legacy-shaped fruit still use the old timing — see
 * `PlantedFruit.baseDurationMs`.
 */
export const getFruitReadyAt = (
  plantedFruit: PlantedFruit,
  game: GameState,
  fertiliser?: FruitFertiliser,
): number => {
  const { seed } = PATCH_FRUIT[plantedFruit.name];
  const { plantSeconds } = PATCH_FRUIT_SEEDS[seed];

  const startedAt = plantedFruit.harvestedAt || plantedFruit.plantedAt;

  if (plantedFruit.baseDurationMs !== undefined) {
    return computeReadyAt({
      startedAt,
      baseDurationMs: plantedFruit.baseDurationMs,
      windows: [
        ...getFruitBoostWindows(game),
        ...getTurbofruitMixWindows(fertiliser),
      ],
    });
  }

  return startedAt + plantSeconds * 1000;
};

export const isFruitReadyToHarvest = (
  now: number,
  plantedFruit: PlantedFruit,
  game: GameState,
  fertiliser?: FruitFertiliser,
): boolean => now >= getFruitReadyAt(plantedFruit, game, fertiliser);
