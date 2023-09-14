import Decimal from "decimal.js-light";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartAdvancedComposterAction = {
  type: "advancedComposter.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartAdvancedComposterAction;
  createdAt?: number;
};

const advancedComposterRequirements: Partial<
  Record<InventoryItemName, Decimal>
> = {
  Kale: new Decimal(5),
  Egg: new Decimal(1),
};

export const hasRequirements = (game: GameState) =>
  Object.entries(advancedComposterRequirements).every(([name, amount]) => {
    const itemAmount =
      game.inventory[name as InventoryItemName] || new Decimal(0);
    return itemAmount.gte(amount);
  });

export function startAdvancedComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  if (!stateCopy.buildings["Advanced Composter"]) {
    throw new Error("Composter does not exist");
  }

  const composter = stateCopy.buildings["Advanced Composter"][0];

  const isProducing = composter.producing;
  if (isProducing && isProducing.readyAt > createdAt) {
    throw new Error("Composter is already composting");
  }

  // if player is missing the requirements, throw an error
  if (!hasRequirements(stateCopy)) {
    throw new Error("Missing requirements");
  }

  // remove the requirements from the player's inventory
  Object.entries(advancedComposterRequirements).forEach(([name, amount]) => {
    const itemAmount =
      stateCopy.inventory[name as InventoryItemName] || new Decimal(0);
    stateCopy.inventory[name as InventoryItemName] = itemAmount.minus(amount);
  });

  // 8hrs in milliseconds
  const timeToFinish = 8 * 60 * 60 * 1000;

  // start the production
  composter.producing = {
    name: "Grub",
    startedAt: createdAt,
    readyAt: createdAt + timeToFinish,
  };

  return stateCopy;
}
