import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import {
  ANIMALS,
  CraftableItem,
  CraftableName,
  CRAFTABLES,
  FOODS,
  SHOVELS,
  TOOLS,
} from "../types/craftables";
import { SEEDS } from "../types/crops";
import { GameState, Inventory } from "../types/game";
import { isSeed } from "./plant";

export type CraftAction = {
  type: "item.crafted";
  item: CraftableName;
  amount: number;
};

/**
 * Only tools, seeds and food can be crafted through the craft function
 * NFTs are not crafted through this function, they are a direct call to the Polygon Blockchain
 */
const VALID_ITEMS = Object.keys({
  ...TOOLS,
  ...SHOVELS,
  ...SEEDS(),
  ...FOODS(),
  ...ANIMALS(),
}) as CraftableName[];

function isCraftable(
  item: CraftableName,
  names: CraftableName[]
): item is CraftableName {
  return names.includes(item);
}

export function getBuyPrice(item: CraftableItem, inventory: Inventory) {
  if (isSeed(item.name) && inventory.Kuebiko?.gte(1)) {
    return new Decimal(0);
  }

  if (inventory["Sunflower Shield"]?.gte(1) && item.name === "Sunflower Seed") {
    return new Decimal(0);
  }

  let price = item.tokenAmount;

  if (price && inventory.Artist?.gte(1)) {
    price = price.mul(0.9);
  }

  return price;
}

type Options = {
  state: Readonly<GameState>;
  action: CraftAction;
};

export function craft({ state, action }: Options) {
  const stateCopy = cloneDeep(state);

  if (!isCraftable(action.item, VALID_ITEMS)) {
    throw new Error(`This item is not craftable: ${action.item}`);
  }

  const item = CRAFTABLES()[action.item];

  if (item.disabled) {
    throw new Error("This item is disabled");
  }

  if (item.hidden) {
    throw new Error("This item is hidden from crafting");
  }

  if (action.amount < 1) {
    throw new Error("Invalid amount");
  }

  if (stateCopy.stock[action.item]?.lt(action.amount)) {
    throw new Error("Not enough stock");
  }

  const price = getBuyPrice(item, stateCopy.inventory);
  const totalExpenses = price?.mul(action.amount);

  const isLocked = item.requires && !stateCopy.inventory[item.requires];
  if (isLocked) {
    throw new Error(`Missing ${item.requires}`);
  }

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = item.ingredients?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient.item] || new Decimal(0);
      const totalAmount = ingredient.amount.mul(action.amount);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredient.item}`);
      }

      return {
        ...inventory,
        [ingredient.item]: count.sub(totalAmount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[action.item] || new Decimal(0);

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    inventory: {
      ...subtractedInventory,
      [action.item]: oldAmount.add(action.amount) as Decimal,
    },
    stock: {
      ...stateCopy.stock,
      [action.item]: stateCopy.stock[action.item]?.minus(
        action.amount
      ) as Decimal,
    },
  };
}
