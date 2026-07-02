import type { FruitPatch, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  getFruitBoostWindows,
  getTurbofruitMixWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceFruitPatchAction = {
  type: "fruitPatch.placed";
  name: ResourceName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceFruitPatchAction;
  createdAt?: number;
};

export function placeFruitPatch({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Fruit Patch"] || new Decimal(0)).minus(
      Object.values(game.fruitPatches).filter(
        (patch) => patch.x !== undefined && patch.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No fruit patches available");
    }

    // Search for existing fruit patches that doesn't have x or y
    const existingFruitPatch = Object.entries(game.fruitPatches).find(
      ([_, patch]) => patch.x === undefined && patch.y === undefined,
    );

    // If there is an existing fruit patch that doesn't have x or y, update it
    if (existingFruitPatch) {
      const [id, patch] = existingFruitPatch;
      const existingPatch = {
        ...patch,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };
      if (existingPatch.fruit && existingPatch.removedAt) {
        const fruit = existingPatch.fruit;
        // HarvestedAt will be greater than plantedAt if the fruit was harvested
        const isReplenishing = fruit.harvestedAt > fruit.plantedAt;

        if (fruit.baseDurationMs !== undefined) {
          // Windowed fruit: "pause" growth/replenish across the lift. Bank the
          // work accrued before removal against the current fruit boost windows
          // (+ the patch's Turbofruit Mix), then resume the remainder from now
          // (mirrors placePlot). The active phase is harvestedAt || plantedAt.
          const banked = workAccruedAt({
            startedAt: isReplenishing ? fruit.harvestedAt : fruit.plantedAt,
            at: existingPatch.removedAt,
            windows: [
              ...getFruitBoostWindows(game),
              ...getTurbofruitMixWindows(existingPatch.fertiliser),
            ],
          });
          fruit.baseDurationMs = Math.max(fruit.baseDurationMs - banked, 0);
          if (isReplenishing) {
            fruit.harvestedAt = createdAt;
          } else {
            fruit.plantedAt = createdAt;
          }
        } else if (isReplenishing) {
          // Legacy fruit: back-date so the lifted interval doesn't count.
          const existingProgress = existingPatch.removedAt - fruit.harvestedAt;
          fruit.harvestedAt = createdAt - existingProgress;
        } else {
          const existingProgress = existingPatch.removedAt - fruit.plantedAt;
          fruit.plantedAt = createdAt - existingProgress;
        }
      }
      delete existingPatch.removedAt;

      game.fruitPatches[id] = existingPatch;

      // Early return to avoid adding the new fruit patch
      return game;
    }

    const fruitPatch: FruitPatch = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
    };

    game.fruitPatches = {
      ...game.fruitPatches,
      [action.id as unknown as number]: fruitPatch,
    };

    return game;
  });
}
