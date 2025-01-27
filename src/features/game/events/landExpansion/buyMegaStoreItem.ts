import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ARTEFACT_SHOP_KEYS } from "features/game/types/collectibles";
import {
  GameState,
  InventoryItemName,
  Keys,
  MegaStoreItemName,
} from "features/game/types/game";
import { getChapterTicket } from "features/game/types/chapters";
import { produce } from "immer";

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
  return produce(state, (stateCopy) => {
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
            "You already have reached the max allowed for this item",
          );
        }
      } else {
        const currentAmount =
          stateCopy.inventory[name as InventoryItemName] ?? new Decimal(0);

        if (currentAmount.greaterThanOrEqualTo(item.limit)) {
          throw new Error(
            "You already have reached the max allowed for this item",
          );
        }
      }
    }

    const currency =
      item.currency === "Chapter Ticket" ? getChapterTicket() : item.currency;

    // Handle SFL purchase
    if (currency === "SFL") {
      if (stateCopy.balance.lessThan(item.price)) {
        throw new Error("Not enough SFL");
      }

      stateCopy.balance = stateCopy.balance.sub(item.price);

      stateCopy.bumpkin.activity = trackActivity(
        "SFL Spent",
        stateCopy.bumpkin.activity,
        item.price,
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
    } else {
      const oldAmount =
        stateCopy.inventory[name as InventoryItemName] ?? new Decimal(0);

      stateCopy.inventory[name as InventoryItemName] = oldAmount.add(1);
    }

    const isKey = (name: MegaStoreItemName): name is Keys =>
      name in ARTEFACT_SHOP_KEYS;

    // This is where the key is bought
    if (isKey(name)) {
      const keyBoughtAt =
        stateCopy.pumpkinPlaza.keysBought?.megastore[name as Keys]?.boughtAt;
      if (keyBoughtAt) {
        const currentTime = new Date(createdAt).toISOString().slice(0, 10);
        const lastBoughtTime = new Date(keyBoughtAt).toISOString().slice(0, 10);

        if (currentTime === lastBoughtTime) {
          throw new Error("Already bought today");
        }
      }
      // Ensure `keysBought` is properly initialized
      if (!stateCopy.pumpkinPlaza.keysBought) {
        stateCopy.pumpkinPlaza.keysBought = {
          treasureShop: {},
          megastore: {},
          factionShop: {},
        };
      }

      stateCopy.pumpkinPlaza.keysBought.megastore[name as Keys] = {
        boughtAt: createdAt,
      };
    }

    return stateCopy;
  });
}
