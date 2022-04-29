import Decimal from "decimal.js-light";
import {
  Craftable,
  CraftableName,
  CRAFTABLES,
  FOODS,
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
  ...SEEDS(),
  ...FOODS(),
}) as CraftableName[];

function isCraftable(
  item: CraftableName,
  names: CraftableName[]
): item is CraftableName {
  return names.includes(item);
}

export function getBuyPrice(item: Craftable, inventory: Inventory) {
  if (isSeed(item.name) && inventory.Kuebiko?.gte(1)) {
    return new Decimal(0);
  }

  return item.price;
}

type Options = {
  state: GameState;
  action: CraftAction;
  available?: CraftableName[];
};

export function craft({ state, action, available }: Options) {
  if (!isCraftable(action.item, available || VALID_ITEMS)) {
    throw new Error(`This item is not craftable: ${action.item}`);
  }

  const item = CRAFTABLES()[action.item];
  if (item.disabled) {
    throw new Error("This item is disabled");
  }

  if (action.amount < 1) {
    throw new Error("Invalid amount");
  }

  if (state.stock[action.item]?.lt(action.amount)) {
    throw new Error("Not enough stock");
  }

  const price = getBuyPrice(item, state.inventory);
  const totalExpenses = price.mul(action.amount);

  const isLocked = item.requires && !state.inventory[item.requires];
  if (isLocked) {
    throw new Error(`Missing ${item.requires}`);
  }

  if (state.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = item.ingredients.reduce(
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
    state.inventory
  );

  const oldAmount = state.inventory[action.item] || new Decimal(0);

  return {
    ...state,
    balance: state.balance.sub(totalExpenses),
    inventory: {
      ...subtractedInventory,
      [action.item]: oldAmount.add(action.amount),
    },
    stock: {
      ...state.stock,
      [action.item]: state.stock[action.item]?.minus(action.amount),
    },
  };
}
