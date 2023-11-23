import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";

import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import {
  CommunityShopItemName,
  COMMUNITY_SHOP_ITEMS,
} from "features/game/types/collectibles";

export type CraftCommunityItemAction = {
  type: "communityShop.crafted";
  name: CommunityShopItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: CraftCommunityItemAction;
  createdAt?: number;
};

export function craftCommunityItem({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const item = COMMUNITY_SHOP_ITEMS[action.name];

  if (!item) {
    throw new Error("Item does not exist");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  const subtractedInventory = getKeys(item.ingredients).reduce(
    (inventory, ingredientName) => {
      const count = inventory[ingredientName] || new Decimal(0);
      const totalAmount = item.ingredients[ingredientName] || new Decimal(0);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      return {
        ...inventory,
        [ingredientName]: count.sub(totalAmount),
      };
    },
    stateCopy.inventory
  );

  const updatedInventory = getKeys(item.packItems).reduce(
    (inventory, packItem) => {
      const count = inventory[packItem] || new Decimal(0);
      const totalAmount = item.packItems[packItem] || new Decimal(0);

      return {
        ...inventory,
        [packItem]: count.add(totalAmount),
      };
    },
    subtractedInventory
  );

  bumpkin.activity = trackActivity(`${action.name} Crafted`, bumpkin.activity);

  return {
    ...stateCopy,
    inventory: {
      ...updatedInventory,
    },
  };
}
