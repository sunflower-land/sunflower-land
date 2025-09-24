import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import { FlowerBed, GameState } from "features/game/types/game";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceFlowerBedAction = {
  type: "flowerBed.placed";
  id: string;
  coordinates: Coordinates;
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
      Object.values(game.flowers.flowerBeds).filter(
        (flowerBed) => flowerBed.x !== undefined && flowerBed.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No flower beds available");
    }

    if (game.flowers.flowerBeds[action.id]) {
      throw new Error("ID exists");
    }

    const existingFlowerBed = Object.entries(game.flowers.flowerBeds).find(
      ([_, flowerBed]) =>
        flowerBed.x === undefined && flowerBed.y === undefined,
    );

    if (existingFlowerBed) {
      const [id, flowerBed] = existingFlowerBed;
      const updatedFlowerBed = {
        ...flowerBed,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedFlowerBed.flower && updatedFlowerBed.removedAt) {
        const existingProgress =
          updatedFlowerBed.removedAt - updatedFlowerBed.flower.plantedAt;
        updatedFlowerBed.flower.plantedAt = createdAt - existingProgress;
      }
      delete updatedFlowerBed.removedAt;

      game.flowers.flowerBeds[id] = updatedFlowerBed;

      const updatedBeehives = updateBeehives({ game, createdAt });

      game.beehives = updatedBeehives;

      return game;
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
