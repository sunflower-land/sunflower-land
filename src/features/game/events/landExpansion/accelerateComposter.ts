import Decimal from "decimal.js-light";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
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

export type AccelerateComposterAction = {
  type: "compost.accelerated";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: AccelerateComposterAction;
  createdAt?: number;
};

export function accelerateComposter({
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
  const producing = composter.producing;

  if (!producing) {
    throw new Error("Composter is not producing");
  }

  if (createdAt > producing.readyAt) {
    throw new Error("Composter already done");
  }

  // Subtract eggs

  // Subtract time

  return stateCopy;
}
