import Decimal from "decimal.js-light";
import {
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
  getKeys,
} from "features/game/types/craftables";

import { trackActivity } from "features/game/types/bumpkinActivity";

import { GameState, Keys } from "../../types/game";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
  POTION_HOUSE_ITEMS,
  PotionHouseItemName,
  TreasureCollectibleItem,
  TREASURE_COLLECTIBLE_ITEM,
  ARTEFACT_SHOP_KEYS,
  POTION_HOUSE_EXOTIC_CROPS,
} from "features/game/types/collectibles";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { produce } from "immer";
import { ExoticCropName } from "features/game/types/beans";
import { isExoticCrop } from "features/game/types/crops";

export const COLLECTIBLE_CRAFT_SECONDS: Partial<
  Record<CollectibleName, number>
> = {
  Bale: 60,
  "Scary Mike": 60,
};

type CraftableCollectibleItem =
  | HeliosBlacksmithItem
  | TreasureCollectibleItem
  | PotionHouseItemName
  | Keys;

export type CraftCollectibleAction = {
  type: "collectible.crafted";
  name: CraftableCollectibleItem;
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
  name: CraftableCollectibleItem,
): name is PotionHouseItemName => name in POTION_HOUSE_ITEMS;

const isTreasureCollectible = (
  name: CraftableCollectibleItem,
): name is TreasureCollectibleItem => name in TREASURE_COLLECTIBLE_ITEM;

const isKey = (name: CraftableCollectibleItem): name is Keys =>
  name in ARTEFACT_SHOP_KEYS;

export function craftCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const bumpkin = stateCopy.bumpkin;

    let item;

    if (isPotionHouseItem(action.name)) {
      item = POTION_HOUSE_ITEMS[action.name];
    } else if (isExoticCrop(action.name as ExoticCropName)) {
      item = POTION_HOUSE_EXOTIC_CROPS[action.name as ExoticCropName];
    } else if (isTreasureCollectible(action.name)) {
      item = TREASURE_COLLECTIBLE_ITEM[action.name];
    } else if (isKey(action.name)) {
      item = ARTEFACT_SHOP_KEYS[action.name];
    } else {
      item = HELIOS_BLACKSMITH_ITEMS(state, new Date(createdAt))[action.name];
    }

    if (!item) {
      throw new Error("Item does not exist");
    }

    if (stateCopy.stock[action.name]?.lt(1)) {
      throw new Error("Not enough stock");
    }

    if (bumpkin === undefined) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (item.from && item.from?.getTime() > createdAt) {
      throw new Error("Too early");
    }

    if (item.to && item.to?.getTime() < createdAt) {
      throw new Error("Too late");
    }

    const price = item.coins ?? 0;

    if (stateCopy.coins < price) {
      throw new Error("Insufficient Coins");
    }

    const subtractedInventory = getKeys(item.ingredients).reduce(
      (inventory, ingredientName) => {
        const count = inventory[ingredientName] || new Decimal(0);
        const totalAmount = item.ingredients[ingredientName] || new Decimal(0);

        if (count.lessThan(totalAmount)) {
          throw new Error(
            `Insufficient ingredient: ${ingredientName.toString()}`,
          );
        }

        return {
          ...inventory,
          [ingredientName]: count.sub(totalAmount),
        };
      },
      stateCopy.inventory,
    );

    const oldAmount = stateCopy.inventory[action.name] || new Decimal(0);

    bumpkin.activity = trackActivity(
      `${action.name} Crafted`,
      bumpkin.activity,
    );

    if (action.coordinates && action.id && !isKey(action.name)) {
      const dimensions = COLLECTIBLES_DIMENSIONS[action.name];
      const collides = detectCollision({
        state: stateCopy,
        position: {
          x: action.coordinates.x,
          y: action.coordinates.y,
          height: dimensions.height,
          width: dimensions.width,
        },
        location: "farm",
        name: action.name,
      });

      if (collides) {
        throw new Error("Decoration collides");
      }

      const previous = stateCopy.collectibles[action.name] ?? [];

      if (previous.find((item) => item.id === action.id)) {
        throw new Error("ID already exists");
      }

      const seconds = COLLECTIBLE_CRAFT_SECONDS[action.name] ?? 0;

      stateCopy.collectibles[action.name] = previous.concat({
        id: action.id,
        coordinates: { x: action.coordinates.x, y: action.coordinates.y },
        readyAt: createdAt + seconds * 1000,

        createdAt: createdAt,
      });
    }

    stateCopy.coins = stateCopy.coins - price;

    bumpkin.activity = trackActivity(
      "Coins Spent",
      bumpkin.activity,
      new Decimal(price),
    );

    stateCopy.inventory = {
      ...subtractedInventory,
      [action.name]: oldAmount.add(1) as Decimal,
    };
    stateCopy.stock[action.name] = stateCopy.stock[action.name]?.minus(1);

    if (isKey(action.name)) {
      const keyBoughtAt =
        stateCopy.pumpkinPlaza.keysBought?.treasureShop[action.name]?.boughtAt;
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

      stateCopy.pumpkinPlaza.keysBought.treasureShop[action.name] = {
        boughtAt: createdAt,
      };
    }

    return stateCopy;
  });
}
