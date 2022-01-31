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

export function craft(state: GameState, action: CraftAction) {
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
      const count = inventory[ingredient.item] || 0;
      const totalAmount = ingredient.amount * action.amount;

      if (count < totalAmount) {
        throw new Error(`Insufficient ingredient: ${ingredient.item}`);
      }

      return {
        ...inventory,
        [ingredient.item]: count - totalAmount,
      };
    },
    state.inventory
  );

  return {
    ...state,
    balance: state.balance.sub(totalExpenses),
    inventory: {
      ...subtractedInventory,
      [action.item]: (state.inventory[action.item] || 0) + action.amount,
    },
  };
}
