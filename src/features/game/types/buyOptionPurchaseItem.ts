import { produce } from "immer";
import { PURCHASEABLE_BAIT, PurchaseableBait } from "./fishing";
import { GameState, Inventory } from "./game";
import { getObjectEntries } from "../expansion/lib/utils";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "./farmActivity";

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

export type OptionPurchaseItemName = PurchaseableBait;

export type BuyOptionPurchaseItemAction = {
  type: "optionPurchaseItem.bought";
  item: OptionPurchaseItemName;
  purchaseType: PurchaseType;
  amount: number;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyOptionPurchaseItemAction;
};

const MULTIPLE_PURCHASE_ITEMS: Record<
  OptionPurchaseItemName | "Test Item",
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

export function buyOptionPurchaseItem({ state, action }: Options) {
  return produce(state, (copy) => {
    const { item, purchaseType, type, amount } = action;

    if (type !== "optionPurchaseItem.bought") {
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
      const coinCost = purchaseOption.coins * amount;
      if (copy.coins < coinCost) {
        throw new Error("Insufficient Coins");
      }

      // Subtract from coins
      copy.coins -= coinCost;
      copy.farmActivity = trackFarmActivity(
        "Coins Spent",
        copy.farmActivity,
        new Decimal(coinCost),
      );
    }

    if (purchaseOption.ingredients) {
      getObjectEntries(purchaseOption.ingredients).forEach(([item, price]) => {
        const currentAmount = copy.inventory[item] ?? new Decimal(0);
        const ingredientCost = new Decimal(price ?? 0).mul(amount);
        if (currentAmount.lessThan(ingredientCost)) {
          throw new Error("Insufficient Items");
        }

        // Subtract from inventory
        copy.inventory[item] = currentAmount.minus(ingredientCost);
      });
    }

    // Add to inventory
    copy.inventory[item] = (copy.inventory[item] ?? new Decimal(0)).plus(
      new Decimal(amount),
    );

    copy.farmActivity = trackFarmActivity(
      `${item} Crafted`,
      copy.farmActivity,
      new Decimal(amount),
    );

    return copy;
  });
}
