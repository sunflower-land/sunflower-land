import { NFT, NFTs, Tool, TOOLS } from "features/blacksmith/lib/craftables";
import { SeedName, SEEDS } from "features/crops/lib/crops";
import { GameState, InventoryItemName } from "../GameProvider";

export type CraftAction = {
  type: "item.crafted";
  item: InventoryItemName;
};

export type CraftableName = NFT | Tool | SeedName;

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
};

function isCraftable(item: InventoryItemName): item is CraftableName {
  return (item as CraftableName) in CRAFTABLES;
}

export function craft(state: GameState, action: CraftAction) {
  if (!isCraftable(action.item)) {
    throw new Error(`This item is not craftable: ${action.item}`);
  }

  const item = CRAFTABLES[action.item];

  const isLocked = item.requires && !state.inventory[item.requires];
  if (isLocked) {
    throw new Error(`Missing ${item.requires}`);
  }

  if (state.balance < item.price) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = item.ingredients.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient.item] || 0;

      if (count < ingredient.amount) {
        throw new Error(`Insufficient ingredient: ${ingredient.item}`);
      }

      return {
        ...inventory,
        [ingredient.item]: count - ingredient.amount,
      };
    },
    state.inventory
  );

  return {
    ...state,
    balance: state.balance - item.price,
    inventory: {
      ...subtractedInventory,
      [action.item]: (state.inventory[action.item] || 0) + 1,
    },
  };
}
