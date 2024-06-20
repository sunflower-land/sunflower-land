import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import {
  FactionShopItemName,
  FACTION_SHOP_ITEMS,
} from "features/game/types/factionShop";
import { GameState, InventoryItemName } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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
}

export function buyFactionShopItem({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy: GameState = cloneDeep(state);
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
      BUY_FACTION_SHOP_ITEM_ERRORS.PLAYER_NOT_IN_REQUIRED_FACTION
    );
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

  return stateCopy;
}
