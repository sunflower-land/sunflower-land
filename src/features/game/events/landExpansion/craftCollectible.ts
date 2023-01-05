import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";

import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
} from "features/game/types/collectibles";

export type CraftCollectibleAction = {
  type: "collectible.crafted";
  name: HeliosBlacksmithItem;
};

type Options = {
  state: Readonly<GameState>;
  action: CraftCollectibleAction;
};

export function craftCollectible({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const item = HELIOS_BLACKSMITH_ITEMS[action.name];

  if (!item) {
    throw new Error("Item does not exist");
  }

  if (stateCopy.stock[action.name]?.lt(1)) {
    throw new Error("Not enough stock");
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

  const oldAmount = stateCopy.inventory[action.name] || new Decimal(0);

  bumpkin.activity = trackActivity(`${action.name} Crafted`, bumpkin.activity);

  return {
    ...stateCopy,
    inventory: {
      ...subtractedInventory,
      [action.name]: oldAmount.add(1) as Decimal,
    },
    stock: {
      ...stateCopy.stock,
      [action.name]: stateCopy.stock[action.name]?.minus(1) as Decimal,
    },
  };
}
