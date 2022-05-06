import Decimal from "decimal.js-light";
import {
  CraftableItem,
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

export function getBuyPrice(item: CraftableItem, inventory: Inventory) {
  if (isSeed(item.name) && inventory.Kuebiko?.gte(1)) {
    return new Decimal(0);
  }

  let price = item.tokenAmount;

  if (price && inventory.Artist?.gte(1)) {
    price = price.mul(0.9);
  }

  return price;
}

type Options = {
  state: GameState;
  action: CraftAction;
};

export function craft({ state, action }: Options) {
  if (!isCraftable(action.item, VALID_ITEMS)) {
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
  const totalExpenses = price?.mul(action.amount);

  const isLocked = item.requires && !state.inventory[item.requires];
  if (isLocked) {
    throw new Error(`Missing ${item.requires}`);
  }

  if (totalExpenses && state.balance.lessThan(totalExpenses)) {
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
    state.inventory
  );

  const oldAmount = state.inventory[action.item] || new Decimal(0);

  return {
    ...state,
    balance: totalExpenses ? state.balance.sub(totalExpenses) : state.balance,
    inventory: {
      ...subtractedInventory,
      [action.item]: oldAmount.add(action.amount) as Decimal,
    },
    stock: {
      ...state.stock,
      [action.item]: state.stock[action.item]?.minus(action.amount) as Decimal,
    },
  };
}
