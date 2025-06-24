import { produce } from "immer";
import { PURCHASEABLE_BAIT, PurchaseableBait } from "./fishing";
import { GameState, Inventory } from "./game";
import { getObjectEntries } from "../expansion/lib/utils";
import Decimal from "decimal.js-light";
import { trackActivity } from "./bumpkinActivity";

// Add to this type if more purchase types are added
export type PurchaseType = "Gem" | "Feather";

type PurchaseCost = {
  coins?: number;
  ingredients?: Inventory;
};

export type PurchaseOptions = {
  name: string;
  description: string;
  // Wrapped in object just in case more than one item is needed
  purchaseOptions: Partial<Record<PurchaseType, PurchaseCost>>;
};

export type MultiplePurchaseItemName = PurchaseableBait;

export type BuyMultiplePurchaseItemAction = {
  type: "multiplePurchaseItem.bought";
  item: MultiplePurchaseItemName;
  purchaseType: PurchaseType;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMultiplePurchaseItemAction;
};

const MULTIPLE_PURCHASE_ITEMS: Record<
  MultiplePurchaseItemName | "Test Item",
  PurchaseOptions
> = {
  // Test Item for tests
  "Test Item": {
    name: "Test Item",
    description: "Test Item",
    purchaseOptions: {},
  },
  ...PURCHASEABLE_BAIT,
};

export function buyMultiplePurchaseItem({ state, action }: Options) {
  return produce(state, (copy) => {
    const { item, purchaseType, type, amount } = action;

    if (type !== "multiplePurchaseItem.bought") {
      throw new Error("Invalid action type");
    }

    const itemDetails = MULTIPLE_PURCHASE_ITEMS[item];
    if (!itemDetails) {
      throw new Error("Item does not exist");
    }
    const { purchaseOptions } = itemDetails;

    if (Object.keys(purchaseOptions).length === 0) {
      throw new Error("No purchase options found");
    }

    const purchaseOption = purchaseOptions[purchaseType];

    if (!purchaseOption) {
      throw new Error("Invalid purchase type");
    }

    if (purchaseOption.coins) {
      if (copy.coins < purchaseOption.coins) {
        throw new Error("Insufficient Coins");
      }

      // Subtract from coins
      copy.coins -= purchaseOption.coins;
      copy.bumpkin.activity = trackActivity(
        "Coins Spent",
        copy.bumpkin.activity,
        new Decimal(purchaseOption.coins),
      );
    }

    if (purchaseOption.ingredients) {
      getObjectEntries(purchaseOption.ingredients).forEach(([item, amount]) => {
        const currentAmount = copy.inventory[item] ?? new Decimal(0);
        const ingredientCost = amount ?? new Decimal(0);
        if (currentAmount.lessThan(ingredientCost)) {
          throw new Error("Insufficient Items");
        }

        // Subtract from inventory
        copy.inventory[item] = currentAmount.minus(ingredientCost);
      });
    }

    // Add to inventory
    copy.inventory[item] = (copy.inventory[item] ?? new Decimal(0)).plus(
      new Decimal(action.amount),
    );

    copy.bumpkin.activity = trackActivity(
      `${item} Crafted`,
      copy.bumpkin.activity,
      new Decimal(amount),
    );

    return copy;
  });
}
