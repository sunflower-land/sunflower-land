import { FruitPatch, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

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
        // HarvestedAt will be greater than plantedAt if the fruit was harvested
        if (existingPatch.fruit.harvestedAt > existingPatch.fruit.plantedAt) {
          const existingProgress =
            existingPatch.removedAt - existingPatch.fruit.harvestedAt;
          existingPatch.fruit.harvestedAt = createdAt - existingProgress;
        } else {
          const existingProgress =
            existingPatch.removedAt - existingPatch.fruit.plantedAt;
          existingPatch.fruit.plantedAt = createdAt - existingProgress;
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
