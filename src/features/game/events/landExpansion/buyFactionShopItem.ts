import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  FactionShopItemName,
  FACTION_SHOP_ITEMS,
  FACTION_SHOP_KEYS,
} from "features/game/types/factionShop";
import { GameState, InventoryItemName, Keys } from "features/game/types/game";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type BuyFactionShopItemAction = {
  type: "factionShopItem.bought";
  item: FactionShopItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyFactionShopItemAction;
  createdAt?: number;
};

export enum BUY_FACTION_SHOP_ITEM_ERRORS {
  NO_BUMPKIN = "Bumpkin not found",
  ITEM_NOT_FOUND = "This item does not exist",
  PLAYER_NOT_IN_REQUIRED_FACTION = "Player is not in the required faction",
  NOT_ENOUGH_MARKS = "Player does not have enough marks",
  NO_FACTION = "Player does not belong to a faction",
  NOT_ENOUGH_PREREQUISITE = "Player does not have enough required item",
  PREREQUISITE_IS_EQUIPPED = "Player is using required item",
}

export function buyFactionShopItem({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { faction, inventory, wardrobe, bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.NO_BUMPKIN);
    }

    if (!faction?.name) {
      throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.NO_FACTION);
    }

    const item = FACTION_SHOP_ITEMS[action.item];

    if (!item) {
      throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.ITEM_NOT_FOUND);
    }

    const { faction: requiredFaction, price, type } = item;

    if (requiredFaction && faction?.name !== requiredFaction) {
      throw new Error(
        BUY_FACTION_SHOP_ITEM_ERRORS.PLAYER_NOT_IN_REQUIRED_FACTION,
      );
    }
    if (item.requires) {
      const currentWardrobe = wardrobe[item.requires as BumpkinItem] ?? 0;
      if (
        isWearableActive({
          name: item.requires as BumpkinItem,
          game: stateCopy,
        })
      ) {
        throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.PREREQUISITE_IS_EQUIPPED);
      }
      const burnAmount = 1; // We expect that the wearable being burnt is always 1
      if (currentWardrobe < burnAmount || currentWardrobe === 0) {
        throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.NOT_ENOUGH_PREREQUISITE);
      }
      wardrobe[item.requires as BumpkinItem] = currentWardrobe - burnAmount;
    }

    const marksBalance = inventory["Mark"] ?? new Decimal(0);

    if (marksBalance.lt(price)) {
      throw new Error(BUY_FACTION_SHOP_ITEM_ERRORS.NOT_ENOUGH_MARKS);
    }

    inventory.Mark = marksBalance.minus(price);

    if (type === "wearable") {
      const current = wardrobe[action.item as BumpkinItem] ?? 0;

      wardrobe[action.item as BumpkinItem] = current + 1;
    } else {
      const current =
        inventory[action.item as InventoryItemName] ?? new Decimal(0);

      inventory[action.item as InventoryItemName] = current.add(1);
    }

    const isKey = (name: FactionShopItemName): name is Keys =>
      name in FACTION_SHOP_KEYS;

    // This is where the key is bought
    if (isKey(action.item)) {
      const keyBoughtAt =
        stateCopy.pumpkinPlaza.keysBought?.factionShop[action.item as Keys]
          ?.boughtAt;
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

      stateCopy.pumpkinPlaza.keysBought.factionShop[action.item as Keys] = {
        boughtAt: createdAt,
      };
    }

    stateCopy.farmActivity = trackFarmActivity(
      `${action.item} Bought`,
      stateCopy.farmActivity,
    );

    return stateCopy;
  });
}
