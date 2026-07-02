import type { FruitPatch, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  getFruitBoostWindows,
  getTurbofruitMixWindows,
  pauseWindowedTimer,
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
        // HarvestedAt will be greater than plantedAt if the fruit was harvested;
        // pause the active phase (windowed banking or legacy back-date) and write
        // the resumed start back to that same phase field.
        const isReplenishing = fruit.harvestedAt > fruit.plantedAt;
        const newStart = pauseWindowedTimer({
          timer: fruit,
          startedAt: isReplenishing ? fruit.harvestedAt : fruit.plantedAt,
          removedAt: existingPatch.removedAt,
          createdAt,
          windows: [
            ...getFruitBoostWindows(game),
            ...getTurbofruitMixWindows(existingPatch.fertiliser),
          ],
          trackProgress: true,
        });
        if (isReplenishing) {
          fruit.harvestedAt = newStart;
        } else {
          fruit.plantedAt = newStart;
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
