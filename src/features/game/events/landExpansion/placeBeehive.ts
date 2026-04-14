import Decimal from "decimal.js-light";
import {
  getActiveBeehives,
  updateBeehives,
} from "features/game/lib/updateBeehives";
import { Beehive, GameState } from "features/game/types/game";
import { produce } from "immer";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceBeehiveAction = {
  type: "beehive.placed";
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceBeehiveAction;
  createdAt?: number;
};

export function placeBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const activeBeehives = getActiveBeehives(copy.beehives);
    const available = (copy.inventory.Beehive || new Decimal(0)).minus(
      Object.keys(activeBeehives).length,
    );

    if (available.lte(0)) {
      throw new Error("You do not have any available beehives");
    }

    const existingBeehive = Object.entries(copy.beehives).find(
      ([_, hive]) => hive.x === undefined && hive.y === undefined,
    );

    if (existingBeehive) {
      const [id, hive] = existingBeehive;
      const updatedHive = {
        ...hive,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      copy.beehives[id] = updatedHive;

      const updatedBeehives = updateBeehives({
        game: copy,
        createdAt,
      });
      delete updatedHive.removedAt;

      copy.beehives = updatedBeehives;

      return copy;
    }

    const beehive: Beehive = {
      x: action.coordinates.x,
      y: action.coordinates.y,
      swarm: false,
      honey: {
        updatedAt: createdAt,
        produced: 0,
      },
      flowers: [],
    };

    copy.beehives = { ...copy.beehives, [action.id]: beehive };

    const updatedBeehives = updateBeehives({
      game: copy,
      createdAt,
    });

    copy.beehives = updatedBeehives;

    return copy;
  });
}
