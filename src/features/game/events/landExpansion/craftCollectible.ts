import Decimal from "decimal.js-light";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";

import { trackActivity } from "features/game/types/bumpkinActivity";
import cloneDeep from "lodash.clonedeep";

import { GameState } from "../../types/game";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
  POTION_HOUSE_ITEMS,
  PotionHouseItemName,
} from "features/game/types/collectibles";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";

export type CraftCollectibleAction = {
  type: "collectible.crafted";
  name: HeliosBlacksmithItem | PotionHouseItemName;
  id?: string;
  coordinates?: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: CraftCollectibleAction;
  createdAt?: number;
};

const isPotionHouseItem = (
  name: HeliosBlacksmithItem | PotionHouseItemName
): name is PotionHouseItemName => {
  return name in POTION_HOUSE_ITEMS;
};

export function craftCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const bumpkin = stateCopy.bumpkin;

  const item = isPotionHouseItem(action.name)
    ? POTION_HOUSE_ITEMS[action.name]
    : HELIOS_BLACKSMITH_ITEMS(state, new Date(createdAt))[action.name];

  if (!item) {
    throw new Error("Item does not exist");
  }

  if (stateCopy.stock[action.name]?.lt(1)) {
    throw new Error("Not enough stock");
  }

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (item.from && item.from?.getTime() > createdAt) {
    throw new Error("Too early");
  }

  if (item.to && item.to?.getTime() < createdAt) {
    throw new Error("Too late");
  }

  const totalExpenses = item.sfl || new Decimal(0);

  if (stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient SFL");
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

  if (action.coordinates && action.id) {
    const dimensions = COLLECTIBLES_DIMENSIONS[action.name];
    const collides = detectCollision(stateCopy, {
      x: action.coordinates.x,
      y: action.coordinates.y,
      height: dimensions.height,
      width: dimensions.width,
    });

    if (collides) {
      throw new Error("Decoration collides");
    }

    const previous = stateCopy.collectibles[action.name] ?? [];

    if (previous.find((item) => item.id === action.id)) {
      throw new Error("ID already exists");
    }

    stateCopy.collectibles[action.name] = previous.concat({
      id: action.id,
      coordinates: { x: action.coordinates.x, y: action.coordinates.y },
      readyAt: createdAt,
      createdAt: createdAt,
    });
  }

  return {
    ...stateCopy,
    balance: stateCopy.balance.sub(totalExpenses),
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
