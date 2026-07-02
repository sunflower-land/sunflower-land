import Decimal from "decimal.js-light";
import { updateBeehives } from "features/game/lib/updateBeehives";
import type { FlowerBed, GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  getFlowerBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

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
        const flower = updatedFlowerBed.flower;
        if (flower.baseDurationMs !== undefined) {
          // Windowed flower: "pause" growth across the lift. Bank the work
          // accrued before removal against the current flower boost windows,
          // then resume the remainder from now (mirrors placePlot). Runs before
          // updateBeehives below so hive pollination sees the corrected timing.
          const banked = workAccruedAt({
            startedAt: flower.plantedAt,
            at: updatedFlowerBed.removedAt,
            windows: getFlowerBoostWindows(game),
          });
          flower.baseDurationMs = Math.max(flower.baseDurationMs - banked, 0);
          flower.plantedAt = createdAt;
        } else {
          // Legacy flower: back-date plantedAt so the lifted interval doesn't count.
          const existingProgress =
            updatedFlowerBed.removedAt - flower.plantedAt;
          flower.plantedAt = createdAt - existingProgress;
        }
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
