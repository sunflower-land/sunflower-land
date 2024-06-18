import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  GameState,
  InventoryItemName,
  MegaStoreItemName,
} from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
import cloneDeep from "lodash.clonedeep";

export type BuyMegaStoreItemAction = {
  type: "megastoreItem.bought";
  name: MegaStoreItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMegaStoreItemAction;
  createdAt?: number;
};

export function buyMegaStoreItem({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy: GameState = cloneDeep(state);
  const { name } = action;

  if (!stateCopy.bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const { megastore } = stateCopy;
  const availableItems = [...megastore.collectibles, ...megastore.wearables];

  const item = availableItems.find((item) => item.name === name);

  if (!item) {
    throw new Error("This item is not available");
  }

  // Check current balance of item if there is a limit
  if (item.limit) {
    if (item.type === "wearable") {
      const currentAmount = stateCopy.wardrobe[name as BumpkinItem] ?? 0;

      if (currentAmount >= item.limit) {
        throw new Error(
          "You already have reached the max allowed for this item"
        );
      }
    } else {
      const currentAmount =
        stateCopy.inventory[name as InventoryItemName] ?? new Decimal(0);

      if (currentAmount.greaterThanOrEqualTo(item.limit)) {
        throw new Error(
          "You already have reached the max allowed for this item"
        );
      }
    }
  }

  const currency =
    item.currency === "Seasonal Ticket" ? getSeasonalTicket() : item.currency;

  // Handle SFL purchase
  if (currency === "SFL") {
    if (stateCopy.balance.lessThan(item.price)) {
      throw new Error("Not enough SFL");
    }

    stateCopy.balance = stateCopy.balance.sub(item.price);

    stateCopy.bumpkin.activity = trackActivity(
      "SFL Spent",
      stateCopy.bumpkin.activity,
      item.price
    );
  } else {
    // Handle inventory item purchase
    const inventoryBalance = stateCopy.inventory[currency] ?? new Decimal(0);

    if (inventoryBalance.lessThan(item.price)) {
      throw new Error(`Not enough ${currency}`);
    }

    stateCopy.inventory[currency] = inventoryBalance.sub(item.price);
  }

  // Wearable
  if (item.type === "wearable") {
    const oldAmount = stateCopy.wardrobe[name as BumpkinItem] ?? 0;

    stateCopy.wardrobe[name as BumpkinItem] = oldAmount + 1;

    return stateCopy;
  }

  // Collectible
  if (item.type === "collectible") {
    const oldAmount =
      stateCopy.inventory[name as InventoryItemName] ?? new Decimal(0);

    stateCopy.inventory[name as InventoryItemName] = oldAmount.add(1);

    return stateCopy;
  }

  return stateCopy;
}
