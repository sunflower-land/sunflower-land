import Decimal from "decimal.js-light";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import {
  CompostBuilding,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartComposterAction = {
  type: "composter.started";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: StartComposterAction;
  createdAt?: number;
};

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const buildings = stateCopy.buildings[action.building] as CompostBuilding[];
  if (!buildings) {
    throw new Error("Composter does not exist");
  }

  const composter = buildings[0];
  const isProducing = composter.producing;

  if (isProducing && isProducing.readyAt > createdAt) {
    throw new Error("Composter is already composting");
  }

  if (!composter.requires) {
    throw new Error("Composter is not ready for produce");
  }

  // remove the requirements from the player's inventory
  getKeys(composter.requires ?? {}).forEach((name) => {
    const previous =
      stateCopy.inventory[name as InventoryItemName] || new Decimal(0);

    if (previous.lt(composter.requires?.[name] ?? 0)) {
      throw new Error("Missing requirements");
    }

    stateCopy.inventory[name as InventoryItemName] = previous.minus(
      composter.requires?.[name] ?? 0
    );
  });

  // start the production
  buildings[0].producing = {
    items: {
      [composterDetails[action.building].produce]: 10,
      // Set on backend
      [composterDetails[action.building].bait]: 1,
    },
    startedAt: createdAt,
    readyAt:
      createdAt + composterDetails[action.building].timeToFinishMilliseconds,
  };

  return stateCopy;
}
