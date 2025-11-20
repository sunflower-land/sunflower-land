import Decimal from "decimal.js-light";
import {
  COLLECTIBLES_DIMENSIONS,
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
  CraftableCollectible,
} from "features/game/types/collectibles";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { produce } from "immer";
import { ExoticCropName } from "features/game/types/beans";
import { isExoticCrop } from "features/game/types/crops";
import { PET_SHOP_ITEMS, PetShopItemName } from "features/game/types/petShop";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

type CraftableCollectibleItem =
  | HeliosBlacksmithItem
  | TreasureCollectibleItem
  | PotionHouseItemName
  | Keys
  | PetShopItemName;

export type CraftCollectibleAction = {
  type: "collectible.crafted";
  name: CraftableCollectibleItem;
  id?: string;
  coordinates?: Coordinates;
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

const isPetShopItem = (
  name: CraftableCollectibleItem,
): name is PetShopItemName => name in PET_SHOP_ITEMS;

export function craftCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const bumpkin = stateCopy.bumpkin;

    let item: CraftableCollectible | undefined;

    if (isPotionHouseItem(action.name)) {
      item = POTION_HOUSE_ITEMS[action.name];
    } else if (isExoticCrop(action.name as ExoticCropName)) {
      item =
        POTION_HOUSE_EXOTIC_CROPS[
          action.name as Exclude<
            ExoticCropName,
            "Giant Orange" | "Giant Apple" | "Giant Banana"
          >
        ];
    } else if (isTreasureCollectible(action.name)) {
      item = TREASURE_COLLECTIBLE_ITEM[action.name];
    } else if (isKey(action.name)) {
      item = ARTEFACT_SHOP_KEYS[action.name];
    } else if (isPetShopItem(action.name)) {
      item = PET_SHOP_ITEMS[action.name];
    } else {
      item = HELIOS_BLACKSMITH_ITEMS[action.name];
    }

    if (!item) {
      throw new Error("Item does not exist");
    }

    if (item.disabled) {
      throw new Error("Item is disabled");
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
    const { limit } = item;
    const isItemCrafted = stateCopy.bumpkin.activity[`${action.name} Crafted`];

    if (limit && isItemCrafted && isItemCrafted >= limit) {
      throw new Error("Limit reached");
    }

    if (
      item.inventoryLimit &&
      stateCopy.inventory[action.name]?.gte(item.inventoryLimit)
    ) {
      throw new Error("Inventory limit reached");
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

    if (
      action.coordinates &&
      action.id &&
      !isKey(action.name) &&
      action.name !== "Pet Egg"
    ) {
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

      stateCopy.collectibles[action.name] = previous.concat({
        id: action.id,
        coordinates: { x: action.coordinates.x, y: action.coordinates.y },
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
