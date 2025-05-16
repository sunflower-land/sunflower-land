import Decimal from "decimal.js-light";
import { FlowerBed, GameState } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { produce } from "immer";

export type PlaceFlowerBedAction = {
  type: "flowerBed.placed";
  id: string;
  coordinates: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceFlowerBedAction;
  createdAt?: number;
};

export function placeFlowerBed({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (game.inventory["Flower Bed"] || new Decimal(0)).minus(
      Object.keys(game.flowers.flowerBeds).length,
    );

    if (available.lt(1)) {
      throw new Error("No flower beds available");
    }

    const dimensions = RESOURCE_DIMENSIONS["Flower Bed"];
    const collides = detectCollision({
      state,
      name: "Flower Bed",
      location: "farm",
      position: {
        x: action.coordinates.x,
        y: action.coordinates.y,
        height: dimensions.height,
        width: dimensions.width,
      },
    });

    if (collides) {
      throw new Error("Flower Bed collides");
    }

    if (game.flowers.flowerBeds[action.id]) {
      throw new Error("ID exists");
    }

    const flowerBed: FlowerBed = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
    };

    game.flowers.flowerBeds = {
      ...game.flowers.flowerBeds,
      [action.id]: flowerBed,
    };

    return game;
  });
}
