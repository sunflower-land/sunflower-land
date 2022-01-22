import { NFT, NFTs, Tool, TOOLS, Food, FOODS } from "features/blacksmith/lib/craftables";
import { SeedName, SEEDS } from "features/crops/lib/crops";
import { GameState, InventoryItemName } from "../lib/types";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
  amount: number;
};

export type CraftableName = NFT | Tool | SeedName | Food;

export type Craftable = {
  name: CraftableName;
  image: any;
  description: string;
  price: number;
  ingredients: {
    item: InventoryItemName;
    amount: number;
  }[];
  limit?: number;
  amountLeft?: number;
  disabled?: boolean;
  type?: "NFT";
  requires?: InventoryItemName;
};

export const CRAFTABLES: Record<CraftableName, Craftable> = {
  ...TOOLS,
  ...NFTs,
  ...SEEDS,
  ...FOODS,
};

function isCraftable(item: InventoryItemName): item is CraftableName {
  return (item as CraftableName) in CRAFTABLES;
}

export function craft(state: GameState, action: CraftAction) {
  if (!isCraftable(action.item)) {
    throw new Error(`This item is not craftable: ${action.item}`);
  }

  const item = CRAFTABLES[action.item];
  const totalExpenses = item.price * action.amount;

  const isLocked = item.requires && !state.inventory[item.requires];
  if (isLocked) {
    throw new Error(`Missing ${item.requires}`);
  }

  if (state.balance < totalExpenses) {
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
    balance: state.balance - totalExpenses,
    inventory: {
      ...subtractedInventory,
      [action.item]: (state.inventory[action.item] || 0) + action.amount,
    },
  };
}
