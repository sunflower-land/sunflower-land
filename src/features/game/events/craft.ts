import Decimal from "decimal.js-light";
import { CraftableName, CRAFTABLES } from "../types/craftables";
import { GameState, InventoryItemName } from "../types/game";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

function isCraftable(item: InventoryItemName): item is CraftableName {
  return (item as CraftableName) in CRAFTABLES;
}

type Options = {
  state: GameState;
  action: CraftAction;
};
export function craft({ state, action }: Options) {
  if (!isCraftable(action.item)) {
    throw new Error(`This item is not craftable: ${action.item}`);
  }

  if (action.amount !== 1 && action.amount !== 10) {
    throw new Error("Invalid amount");
  }

  const item = CRAFTABLES[action.item];
  const totalExpenses = item.price * action.amount;

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
      const totalAmount = ingredient.amount * action.amount;

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
  };
}
