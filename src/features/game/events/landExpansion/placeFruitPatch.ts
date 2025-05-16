import { FruitPatch, GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";

export type PlaceFruitPatchAction = {
  type: "fruitPatch.placed";
  name: ResourceName;
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
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
      Object.keys(game.fruitPatches).length,
    );

    if (available.lt(1)) {
      throw new Error("No fruit patches available");
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
