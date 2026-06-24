import type { FiniteResource, GameState } from "features/game/types/game";
import type { ResourceName } from "features/game/types/resources";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceAscensionCrystalAction = {
  type: "ascensionCrystal.placed";
  name: ResourceName;
  id: string;
  coordinates: Coordinates;
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceAscensionCrystalAction;
  createdAt?: number;
};

export function placeAscensionCrystal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const available = (
      game.inventory["Ascension Crystal"] || new Decimal(0)
    ).minus(
      Object.values(game.ascensionCrystals).filter(
        (rock) => rock.x !== undefined && rock.y !== undefined,
      ).length,
    );

    if (available.lt(1)) {
      throw new Error("No ascension crystal available");
    }

    const existingAscensionCrystal = Object.entries(
      game.ascensionCrystals,
    ).find(([_, rock]) => rock.x === undefined && rock.y === undefined);

    if (existingAscensionCrystal) {
      const [id, rock] = existingAscensionCrystal;
      const updatedAscensionCrystal = {
        ...rock,
        x: action.coordinates.x,
        y: action.coordinates.y,
      };

      if (updatedAscensionCrystal.stone && updatedAscensionCrystal.removedAt) {
        const existingProgress =
          updatedAscensionCrystal.removedAt -
          updatedAscensionCrystal.stone.minedAt;
        updatedAscensionCrystal.stone.minedAt = createdAt - existingProgress;
      }
      delete updatedAscensionCrystal.removedAt;

      game.ascensionCrystals[id] = updatedAscensionCrystal;

      return game;
    }

    const newAscensionCrystal: FiniteResource = {
      createdAt,
      x: action.coordinates.x,
      y: action.coordinates.y,
      stone: {
        minedAt: 0,
      },
      minesLeft: 1,
    };

    game.ascensionCrystals = {
      ...game.ascensionCrystals,
      [action.id]: newAscensionCrystal,
    };

    return game;
  });
}
