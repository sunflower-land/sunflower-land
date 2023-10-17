import Decimal from "decimal.js-light";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { GameState, InventoryItemName } from "features/game/types/game";
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

export const hasRequirements = (
  game: GameState,
  composterName: ComposterName
) =>
  Object.entries(composterDetails[composterName].requirements).every(
    ([name, amount]) => {
      const itemAmount =
        game.inventory[name as InventoryItemName] || new Decimal(0);
      return itemAmount.gte(amount);
    }
  );

export function startComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  if (!stateCopy.buildings[action.building]) {
    throw new Error("Composter does not exist");
  }

  const isProducing = stateCopy.buildings[action.building]?.[0].producing;

  if (isProducing && isProducing.readyAt > createdAt) {
    throw new Error("Composter is already composting");
  }

  // if player is missing the requirements, throw an error
  if (!hasRequirements(stateCopy, action.building)) {
    throw new Error("Missing requirements");
  }

  // remove the requirements from the player's inventory
  Object.entries(composterDetails[action.building].requirements).forEach(
    ([name, amount]) => {
      const itemAmount =
        stateCopy.inventory[name as InventoryItemName] || new Decimal(0);
      stateCopy.inventory[name as InventoryItemName] = itemAmount.minus(amount);
    }
  );

  // start the production
  stateCopy.buildings[action.building]![0].producing = {
    name: composterDetails[action.building].produce,
    readyAt:
      createdAt + composterDetails[action.building].timeToFinishMilliseconds,
    startedAt: createdAt,
  };

  return stateCopy;
}
