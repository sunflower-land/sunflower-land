import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartBasicComposterAction = {
  type: "basicComposter.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartBasicComposterAction;
  createdAt?: number;
};

const basicComposterRequirements: Partial<Record<InventoryItemName, Decimal>> =
  {
    Sunflower: new Decimal(5),
    Pumpkin: new Decimal(3),
    Carrot: new Decimal(2),
  };

export const hasRequirements = (game: GameState) =>
  Object.entries(basicComposterRequirements).every(([name, amount]) => {
    const itemAmount =
      game.inventory[name as InventoryItemName] || new Decimal(0);
    return itemAmount.gte(amount);
  });

export function startBasicComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  if (!stateCopy.buildings["Basic Composter"]) {
    throw new Error("Composter does not exist");
  }

  const isProducing = stateCopy.buildings["Basic Composter"][0].producing;
  if (isProducing && isProducing.readyAt > createdAt) {
    throw new Error("Composter is already composting");
  }

  // if player is missing the requirements, throw an error
  if (!hasRequirements(stateCopy)) {
    throw new Error("Missing requirements");
  }

  // remove the requirements from the player's inventory
  Object.entries(basicComposterRequirements).forEach(([name, amount]) => {
    const itemAmount =
      stateCopy.inventory[name as InventoryItemName] || new Decimal(0);
    stateCopy.inventory[name as InventoryItemName] = itemAmount.minus(amount);
  });

  // 6hrs in milliseconds
  const timeToFinish = 6 * 60 * 60 * 1000;

  // start the production
  stateCopy.buildings["Basic Composter"][0].producing = {
    name: "Earthworm",
    startedAt: createdAt,
    readyAt: createdAt + timeToFinish,
  };

  return stateCopy;
}
