import Decimal from "decimal.js-light";
import {
  Composter,
  composterRequirements,
} from "features/game/types/composters";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartComposterAction = {
  type: "composter.started";
  building: Composter;
};

type Options = {
  state: Readonly<GameState>;
  action: StartComposterAction;
  createdAt?: number;
};

export const hasRequirements = (game: GameState, composterName: Composter) =>
  Object.entries(composterRequirements[composterName].requirements).every(
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
  Object.entries(composterRequirements[action.building].requirements).forEach(
    ([name, amount]) => {
      const itemAmount =
        stateCopy.inventory[name as InventoryItemName] || new Decimal(0);
      stateCopy.inventory[name as InventoryItemName] = itemAmount.minus(amount);
    }
  );

  // start the production
  stateCopy.buildings[action.building]![0].producing = {
    name: composterRequirements[action.building].produce,
    startedAt: createdAt,
    readyAt: createdAt + composterRequirements[action.building].timeToFinish,
  };

  return stateCopy;
}
